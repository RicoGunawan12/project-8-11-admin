import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { _tasks, _posts, _timeline } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { AnalyticsNews } from '../analytics-news';
import { AnalyticsTasks } from '../analytics-tasks';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';
import { useToaster } from 'src/components/toast/Toast';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const nav = useNavigate();
  const [month, setMonth] = useState<number | string>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number | string>(new Date().getFullYear());
  const [analytic, setAnalytic] = useState<{ totalSales: number, transactionCount: number, growthPercentage: number, growthCountPercentage: number }>();
  const [allMonthAnalytic, setAllMonthAnalytic] = useState<{ month: number, totalSales: number }[]>([]);
  const [categoryAnalytic, setCategoryAnalytic] = useState<{ categoryName: string, totalSales: number }[]>([]);
  const { showSuccessToast, showErrorToast } = useToaster();

  useEffect(() => {
    async function getTransactionAnalytics() {
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/transactions/analytic/sales`, {
          year,
          month
        }, {
          headers: {
            Authorization: `Bearer ${Cookies.get('tys-token')}`,
          },
        });
        setAnalytic(response.data.response);
      } catch (error) {
        if (error.status === 401) {
          nav('/');        
        }
        showErrorToast(error.message);
      }
    }
    
    async function getAllMonthAnalytics() {
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/transactions/analytic/all/month`, {
          year
        }, {
          headers: {
            Authorization: `Bearer ${Cookies.get('tys-token')}`,
          },
        });
        setAllMonthAnalytic(response.data.response);
        console.log(response.data.response);
      } catch (error) {
        
        if (error.status === 401) {
          nav('/');        
        }
        showErrorToast(error.message);
      }
    }

    async function getCategoryAnalytics() {
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/transactions/analytic/category`, {
          year, month
        }, {
          headers: {
            Authorization: `Bearer ${Cookies.get('tys-token')}`,
          },
        });
        setCategoryAnalytic(response.data.response);
        console.log(response.data.response);
      } catch (error) {
        
        if (error.status === 401) {
          nav('/');        
        }
        console.log(error);
        
        showErrorToast(error.message);
      }
    }

    getTransactionAnalytics();
    getAllMonthAnalytics();
    getCategoryAnalytics();
  }, [month, year]);

  const processChartData = () => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
    return {
      categories: monthNames, // Extract month names
      series: [
        {
          name: "Sales",
          data: allMonthAnalytic.map((item) => item.totalSales), // Extract total sales
        },
      ],
    };
  };

  const convertToPieChartFormat = () => {
    return {
      series: categoryAnalytic.map((item) => ({
        label: item.categoryName,
        value: item.totalSales,
      })),
    };
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back 👋
      </Typography>

      <div>
        <FormControl sx={{ m: 1, minWidth: 100 }}>
          <InputLabel id="demo-simple-select-autowidth-label">Month</InputLabel>
          <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            autoWidth
            label="Month"
          >
            <MenuItem value={0}>
              <em>None</em>
            </MenuItem>
            <MenuItem value={1}>January</MenuItem>
            <MenuItem value={2}>February</MenuItem>
            <MenuItem value={3}>March</MenuItem>
            <MenuItem value={4}>April</MenuItem>
            <MenuItem value={5}>May</MenuItem>
            <MenuItem value={6}>June</MenuItem>
            <MenuItem value={7}>July</MenuItem>
            <MenuItem value={8}>August</MenuItem>
            <MenuItem value={9}>September</MenuItem>
            <MenuItem value={10}>October</MenuItem>
            <MenuItem value={11}>November</MenuItem>
            <MenuItem value={12}>December</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ m: 1, minWidth: 100 }}>
          <InputLabel id="demo-simple-select-autowidth-label">Year</InputLabel>
          <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            autoWidth
            label="Year"
          >
            <MenuItem value={0}>
              <em>None</em>
            </MenuItem>
            <MenuItem value={2024}>2024</MenuItem>
            <MenuItem value={2025}>2025</MenuItem>
          </Select>
        </FormControl>
      </div>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={5}>
          <AnalyticsWidgetSummary
            title="Monthly sales"
            percent={analytic ? analytic.growthPercentage : 0}
            total={analytic ? analytic.totalSales : 0}
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-bag.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 28, 35, 50, 82, 84, 177, 212],
            }}
          />
        </Grid>

        {/* <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="New users"
            percent={-0.1}
            total={1352831}
            color="secondary"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 40, 62, 73, 100, 123, 154],
            }}
          />
        </Grid> */}

        <Grid xs={12} sm={6} md={5}>
          <AnalyticsWidgetSummary
            title="Transaction count"
            percent={analytic ? analytic.growthCountPercentage : 0}
            total={analytic ? analytic.transactionCount : 0}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-buy.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [40, 70, 50, 28, 70, 75, 7, 64],
            }}
          />
        </Grid>

        {/* <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Messages"
            percent={3.6}
            total={234}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-message.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid> */}

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentVisits
            title="Sales by category"
            chart={convertToPieChartFormat()}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsWebsiteVisits
            title="Yearly Sales"
            subheader={`${year} Sales`} 
            chart={processChartData()}
          />
        </Grid>

        {/* <Grid xs={12} md={6} lg={8}>
          <AnalyticsConversionRates
            title="Conversion rates"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Italy', 'Japan', 'China', 'Canada', 'France'],
              series: [
                { name: '2022', data: [44, 55, 41, 64, 22] },
                { name: '2023', data: [53, 32, 33, 52, 13] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentSubject
            title="Current subject"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsNews title="News" list={_posts.slice(0, 5)} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline title="Order timeline" list={_timeline} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsTrafficBySite
            title="Traffic by site"
            list={[
              { value: 'facebook', label: 'Facebook', total: 323234 },
              { value: 'google', label: 'Google', total: 341212 },
              { value: 'linkedin', label: 'Linkedin', total: 411213 },
              { value: 'twitter', label: 'Twitter', total: 443232 },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsTasks title="Tasks" list={_tasks} />
        </Grid> */}
      </Grid>
    </DashboardContent>
  );
}
