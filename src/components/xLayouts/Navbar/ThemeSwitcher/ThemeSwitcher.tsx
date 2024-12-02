import { useTheme } from 'next-themes';

// importing icons
import componentIDs from '@/constants/componentIDs';
import { BsMoon, BsSun } from 'react-icons/bs';

const ThemeSwitcher = ({ userLoggedIn }: { userLoggedIn: boolean }) => {
  const { setTheme } = useTheme();

  function themeSwitcher(params: any) {
    setTheme(params);
    window.localStorage.setItem('theme', params);
  }

  return (
    <div
      className={`flex items-center justify-around rounded-[44.49px] bg-[#F2F4FA] p-1 dark:bg-[#111116] ${
        userLoggedIn
          ? 'h-[35px] w-[80px] xsl:mx-[3%] xsl:h-[40px] xsl:w-[85px]'
          : 'mx-[10px] h-[40px] w-[85px] md:mx-3 md:w-[101px] xl:mx-5'
      }`}
      id={componentIDs.header.themeToggle}
    >
      <button
        className={`${
          userLoggedIn
            ? 'h-[30px] w-[47px] xsl:h-[34px] xsl:w-[78px]'
            : 'h-[34px] w-[78px] md:w-[47px]'
        } flex cursor-pointer items-center justify-center rounded-[44.49px] bg-[#FFFFFF] dark:bg-[#111116]`}
        onClick={() => themeSwitcher('light')}
        aria-label="sun"
      >
        <BsSun />
      </button>
      <button
        className={`${
          userLoggedIn
            ? 'h-[30px] w-[47px] xsl:h-[34px] xsl:w-[78px]'
            : 'h-[34px] w-[78px] md:w-[47px]'
        } flex cursor-pointer items-center justify-center rounded-[44.49px] bg-[#F2F4FA] dark:bg-[#2F3037]`}
        onClick={() => themeSwitcher('dark')}
        aria-label="moon"
      >
        <BsMoon />
      </button>
    </div>
  );
};

export default ThemeSwitcher;
