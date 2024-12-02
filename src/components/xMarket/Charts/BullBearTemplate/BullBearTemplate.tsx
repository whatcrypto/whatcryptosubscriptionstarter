"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

// importing ui library
import { Skeleton } from "@/components/ui/skeleton";

// importing library
import ReactEchartsCore from 'echarts-for-react';

// importing functions
import { formatNumber } from '@/utils/formatNumber';
import UseScreenSize from '@/components/UseScreenSize/UseScreenSize';

// importing multilanguage
import { useTranslation } from "@/components/translation/TranslationsProvider";
import { debounce } from 'lodash';

export type BullAndBearChartProps = {
  readonly percentage: number;
};

interface GaugeState {
  center: [string, string];
  radius: string;
  circleClass: string;
  neutralClass: string;
  buyClass: string;
  strongBuyClass: string;
  sellClass: string;
  strongSellClass: string;
}

export default function BullAndBearTemplate({ percentage }: BullAndBearChartProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [gaugeSeries, setGaugeSeries] = useState<any>([]);
  const chartRef = useRef<ReactEchartsCore>(null);
  const [loading, setLoading] = useState(true); const [gaugeState, setGaugeState] = useState<GaugeState>({
    center: ['50%', '85%'],
    radius: '82%',
    circleClass: '',
    neutralClass: '',
    buyClass: '',
    strongBuyClass: '',
    sellClass: '',
    strongSellClass: '',
  });
  const isBelow1440px = UseScreenSize({ screenSize: 1440 });
  const isBelow1200px = UseScreenSize({ screenSize: 1200 });
  const isBelow450px = UseScreenSize({ screenSize: 450 });
  const isBelow380px = UseScreenSize({ screenSize: 380 });

  useEffect(() => {
    if (isBelow380px) {
      setGaugeState({
        center: ['50%', '75%'],
        radius: '50%',
        circleClass: '-translate-x-[25px] -translate-y-[32px]',
        neutralClass: '-translate-y-[70px] -translate-x-[38px]',
        sellClass: '-translate-x-[94px] -translate-y-[52px]',
        buyClass: 'translate-x-[37px] -translate-y-[52px]',
        strongSellClass: '-translate-x-[111px]  -translate-y-[21px]',
        strongBuyClass: 'translate-x-[38px] -translate-y-[25px]',
      });
    } else if (isBelow450px) {
      setGaugeState({
        center: ['50%', '75%'],
        radius: '70%',
        circleClass: '-translate-x-[24px] -translate-y-[37px]',
        neutralClass: '-translate-y-[102px] -translate-x-[36px]',
        sellClass: '-translate-x-[118px] -translate-y-[74px]',
        buyClass: 'translate-x-[57px] -translate-y-[74px]',
        strongSellClass: '-translate-x-[143px]  -translate-y-[21px]',
        strongBuyClass: 'translate-x-[69px] -translate-y-[25px]',
      });
    } else if (isBelow1200px) {
        setGaugeState(prevState => ({
        ...prevState, // Spread the previous state to retain its values
        center: ['50%', '78%'],
        radius: '90%',
        circleClass: '-translate-x-[21px] -translate-y-[44px] xl:-translate-y-[23px]',
      }));
    } else if (isBelow1440px) {
      setGaugeState(prevState => ({
        ...prevState, // Spread the previous state to retain its values
        center: ['50%', '82%'],
        radius: '70%',
        circleClass: '-translate-x-[21px] -translate-y-[44px] xl:-translate-y-[23px]',
      }));
    } else {
      
      setGaugeState(prevState => ({
        ...prevState, // Spread the previous state to retain its values
        center: ['49.6%', '85%'],
        radius: '80%',
        circleClass: '-translate-x-[29px] -translate-y-[44px] xl:-translate-y-[23px]',
      }));
    }
    setLoading(false);
  }, [isBelow1440px, isBelow1200px, isBelow450px, isBelow380px]);

  useEffect(() => {
    const series: any = [{
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      padAngle: 10,
      center: gaugeState?.center,
      radius: gaugeState?.radius,
      min: 0,
      max: 1,
      splitNumber: 10,
      axisLine: {
        lineStyle: {
          width: 10,
          color: [
            [0.195, '#FF4242'],
            [0.205, 'transparent'],
            [0.395, '#FCA580'],
            [0.405, 'transparent'],
            [0.595, '#FEDE83'],
            [0.605, 'transparent'],
            [0.795, '#B7EB75'],
            [0.805, 'transparent'],
            [1, '#1DB66C'],
          ],
        },
      },
      axisTick: { show: false },
      pointer: {
        length: isBelow450px ? '55%' : '65%',
        offsetCenter: ['5%', '-20%'],
        width: 3,
        icon: 'rect',
        itemStyle: { color: theme === 'dark' ? '#FFFFFF' : '#09090B' },
      },
      splitLine: { show: false },
      axisLabel: { show: false },
      title: { offsetCenter: [0, '-10%'], fontSize: 20 },
      detail: { show: false },
      data: [{ value: percentage / 100 }],
    }];
    setGaugeSeries(series);
    setLoading(false);
  }, [gaugeState, percentage, theme, isBelow450px]);

  const handleResize = debounce(() => {
    chartRef.current?.getEchartsInstance().resize();
  }, 200);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
    };
}, []);

  return (
    <>
      {
        loading
          ? (
            <div className='flex items-center justify-center h-[250px] xl:h-[300px]'>
              <Skeleton className="h-[150px] w-[230px] sm:w-[250px] rounded-t-full" />
            </div>
          )
          : (
            <div className={`relative ${isBelow450px ? 'w-auto h-[170px] ' : 'w-[340px] h-[200px] '} flex items-center justify-center pointer-events-none`}>
              <div className='w-full max-[450px]:w-[350px] h-[300px]'>
                <ReactEchartsCore
                  option={{ series: gaugeSeries }}
                  notMerge={true}
                  ref={chartRef}
                  lazyUpdate={true}
                  style={{ height: '100%', width: '100%' }}
                />
              </div>
              <div className='absolute bottom-[65px] left-1/2 '>
                {renderLabels(isBelow450px, gaugeState, t)}
                <div className={`absolute top-[76px] left-[17px] h-[18px] w-[18px] ${gaugeState?.circleClass}  border-2 rounded-full border-primary-text`}></div>
                <div className={`absolute ${isBelow450px ? '-translate-x-[56px] translate-y-[42px]' : '-translate-x-1/2 translate-y-[53%] xl:translate-y-full'} bottom-[-79px] flex justify-center flex-col items-center`}>
                  <span className='text-[#FFCF30] text-[44px] font-[700]'>{formatNumber(Number(percentage), 0, true, true, false)}</span>
                </div>
              </div>
            </div>
          )
      }
    </>
  );
}

function renderLabels(isBelow450px: boolean, gaugeState: any, t: any) {
  return (
    <>
      <span className={`absolute bottom-[-60px] left-[-18px] text-[12px] leading-[15px] min-w-[50px] text-center text-secondary-text ${isBelow450px ? gaugeState?.strongSellClass : '-translate-x-[175px] xl:-translate-x-[142px] laptop:-translate-x-[155px] -translate-y-[38px] xl:-translate-y-[15px]'}`}>
        {t('common:bullAndBearStrongSell')}
      </span>
      <span className={`absolute bottom-[-41px] left-0 text-[12px] leading-3 text-right min-w-[50px] text-secondary-text  ${isBelow450px ? gaugeState?.sellClass : '-translate-x-[135px] xl:-translate-x-[116px] laptop:-translate-x-[129px] -translate-y-[105px] xl:-translate-y-[70px] laptop:-translate-y-[76px]'}`}>
        {t('common:bullAndBearSell')}
      </span>
      <span className={`absolute bottom-[-42px] left-[9px] text-[12px] leading-3 min-w-[50px] text-center text-secondary-text ${isBelow450px ? gaugeState?.neutralClass : '-translate-x-[36px] laptop:-translate-x-[38px] -translate-y-[136px] xl:-translate-y-[96px] laptop:-translate-y-[105px]'} `}>
        {t('common:bullAndBearNeutral')}
      </span>
      <span className={`absolute bottom-[-42px] left-[13px] text-[12px] leading-3 min-w-[50px] text-left text-secondary-text ${isBelow450px ? gaugeState?.buyClass : 'translate-x-[75px] xl:translate-x-[58px] laptop:translate-x-[67px] -translate-y-[105px] xl:-translate-y-[70px] laptop:-translate-y-[76px]'} `}>
        {t('common:bullAndBearBuy')}
      </span>
      <span className={`absolute bottom-[-67px] left-[38px] text-[12px] leading-[15px] min-w-[50px] text-center text-secondary-text ${isBelow450px ? gaugeState?.strongBuyClass : 'translate-x-[103px] xl:translate-x-[71px] laptop:translate-x-[84px] -translate-y-[38px] xl:-translate-y-[15px]'} `}>
        {t('common:bullAndBearStrongBuy')}
      </span>
    </>
  );
};
