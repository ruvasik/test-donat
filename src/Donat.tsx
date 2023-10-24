import {useCallback, useMemo, useRef} from "react";
import * as d3 from "d3";
import {animated, useSpring} from "react-spring";
import styled from "styled-components";

export type IItem = {
    label: string;
    value: number;
    color: string;
}

type IDonatProps = {
    size: 'small' | 'medium' | 'large';
    data: IItem[];
}

type ISliceProps = {
    color: string;
    radius: number;
    width: number;
    slice: d3.PieArcDatum<IItem>;
};

type ILegendItemProps = {
    children?: never;
    color: string;
    label: string;
    value: number;
    perc: number;
}

const SIZES = {
    'small': 100,
    'medium': 150,
    'large': 200,
};

const Wrapper = styled.div`
    display: flex;
    gap:20px;
    align-items: center;
`;

const Legend = styled.div`
    font-size: 18px;
    color: #666;
    font-weight: 500;
`;

const Slice = ({ slice, width, radius, color }: ISliceProps) => {
    const arcPathGenerator = d3.arc();

    const springProps = useSpring({
        to: {
            pos: [slice.startAngle, slice.endAngle] as [number, number],
        },
    });

    const d = springProps.pos.to((start, end) => {
        return arcPathGenerator({
            innerRadius: width,
            outerRadius: radius,
            startAngle: start,
            endAngle: end,
        });
    });

    return (
        <animated.path
            d={d as any}
            fill={color}
            stroke="white"
        />
    );
};

const Color = styled.span`
    display: inline-block;
    vertical-align: middle;
    width: 12px;
    height: 12px;
    margin: 0 8px 0 -18px; 
    border-radius: 50%;
    background-color: currentColor;
`;

const LegendItemWrapper = styled.div`
    padding-left: 15px;
    line-height: 1.6;

    &.active {
      text-decoration: underline;
    }
  
    & > div {
      color: #888;
    }
`;

const LegendItem = ({color, label, value, perc}: ILegendItemProps) => {
    return <LegendItemWrapper>
        <Color style={{color}} />
        <span>{label}</span>
        <div>{new Intl.NumberFormat('ru-RU').format(value)} ({perc}%)</div>
    </LegendItemWrapper>
};

export const Donut = ({ size, data }: IDonatProps) => {
    const radius = SIZES[size] / 2;
    const sum = useMemo(() => data.reduce((prev, cur) => prev + cur.value, 0), [data]);

    const pie = useMemo(() => {
        const pieGenerator = d3
            .pie<any, IItem>()
            .value((d) => d.value || 0);
        return pieGenerator(data);
    }, [data]);

    const allPaths = pie.map((slice, i) => {
        return (
            <Slice
                key={slice.data.label}
                radius={radius}
                slice={slice}
                color={slice.data.color}
                width={SIZES[size] / 3.3}
            />
        );
    });

    const showLegend = useCallback((e: any) => {
        let index = -1;

        if (e.target.nodeName === 'path') {
            index = Array.prototype.indexOf.call(e.target.parentNode.childNodes, e.target);
        }

        if (index > -1)
            (legendRef.current?.childNodes[index] as HTMLElement).classList.add('active');
    }, []);

    const clearLegend = useCallback((e: any) => {
        let index = -1;

        if (e.target.nodeName === 'path') {
            index = Array.prototype.indexOf.call(e.target.parentNode.childNodes, e.target);
        }

        if (index > -1)
            (legendRef.current?.childNodes[index] as HTMLElement).classList.remove('active');
    },[]);

    const legendRef = useRef<HTMLInputElement | null>(null);

    return (
        <Wrapper>
            <svg width={SIZES[size]} height={SIZES[size]} style={{ display: "inline-block" }}
                 onMouseOver={showLegend}
                 onMouseOut={clearLegend}
            >
                <g transform={`translate(${SIZES[size] / 2}, ${SIZES[size] / 2})`}>{allPaths}</g>
            </svg>
            <Legend ref={legendRef}>
                {
                    data.map(({color, label, value}) => ( <LegendItem key={color} {...{
                        label,
                        value,
                        color,
                        perc: Math.round(value / sum * 100)
                    }}/> ))
                }
            </Legend>
        </Wrapper>
    );
};

export default Donut;
