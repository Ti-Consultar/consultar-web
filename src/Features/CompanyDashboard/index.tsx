import { MainTemplate } from "../../components/AppLayout"
import { DashboardContainer, Header, MainContainer, Title } from "./styles"
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import {
    VictoryChart,
    VictoryLine,
    VictoryTheme,
} from "victory";

export const CompanyDashboard = () => {
    const series = [
        {
            name: "Canada",
            data: [
                3.9670002, 5.2650003, 6.201,
                7.8010006, 9.694, 11.214001,
                11.973001, 12.250001, 12.816001,
                13.413001, 13.626961, 14.30356,
                15.295461,
            ],
        },
    ]; // Mock

    return (
        <MainTemplate>
            <MainContainer>
                <Header>
                    <StackedBarChartIcon sx={{ color: '#224071', fontSize: '32px' }}></StackedBarChartIcon>
                    <Title>Dashboard</Title>
                </Header>
                <DashboardContainer>
                    <VictoryChart theme={VictoryTheme.material} height={300} width={800}>
                        <VictoryLine
                            data={series[0].data.map(
                                (d, i) => ({
                                    x: i + 2010,
                                    y: d,
                                }),
                            )}
                        />
                    </VictoryChart>
                </DashboardContainer>
            </MainContainer>
        </MainTemplate>
    )
}
