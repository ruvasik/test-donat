import DonutChart from 'react-donut-chart';

// things I would never do:
export default () => <DonutChart
    data={[
        {
            label: 'Give you up',
            value: 25,
        },
        {
            label: '',
            value: 75,
            isEmpty: true,
        },
    ]}
/>;
