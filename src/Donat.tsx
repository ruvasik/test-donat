import {useMemo} from "react";
import * as d3 from "d3";
import {animated, useSpring} from "react-spring";

export interface IItem {
    label: string;
    value: number;
    color: string;
}

interface IDonatProps {
    size: 'small' | 'medium' | 'large';
    data: IItem[];
}

const SIZES = {
    'small': 100,
    'medium': 150,
    'large': 200,
};

export const Donut = ({ size, data }: IDonatProps) => {
    const radius = SIZES[size] / 2;

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

    return (
        <svg width={SIZES[size]} height={SIZES[size]} style={{ display: "inline-block" }}>
            <g transform={`translate(${SIZES[size] / 2}, ${SIZES[size] / 2})`}>{allPaths}</g>
        </svg>
    );
};

type SliceProps = {
    color: string;
    radius: number;
    width: number;
    slice: d3.PieArcDatum<IItem>;
};
const Slice = ({ slice, width, radius, color }: SliceProps) => {
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
        />
    );
};

export default Donut;
