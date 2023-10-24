import {useMemo} from "react";
import DonutChart from 'react-donut-chart';

export interface IItem {
    label: string;
    value: number;
    color: string;
}

interface IDonatProps {
    size: 'small' | 'medium' | 'large';
    data: IItem[];
}

const Donat = ({data}: IDonatProps) => {
    const colors = useMemo(() => data.map(item => item.color), [data]);

    return <DonutChart
        colors={colors}
        data={[
            {
                label: 'Управление гос. финансами',
                value: 19611120.90,
            },
            {
                label: 'Информационное общество',
                value: 4827629.30,
            },
            {
                label: 'ГП НТР',
                value: 849411.3,
            },
        ]}
    />
};

export default Donat;
