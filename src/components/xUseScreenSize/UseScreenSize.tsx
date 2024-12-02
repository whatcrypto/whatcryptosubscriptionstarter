import { useEffect, useState } from 'react';

interface UseScreenSizeProps {
  screenSize: number;
}

const UseScreenSize = (props: UseScreenSizeProps | number) => {
  let screenSize = 767;

  if (typeof props === 'number') {
    screenSize = props;
  } else {
    screenSize = props.screenSize;
  }

  const [isBelow767px, setIsBelow767px] = useState(false);

  useEffect(() => {
    const updateWindowDimensions = () => {
      setIsBelow767px(document.documentElement.clientWidth < screenSize);
    };

    // Check if the code is running on the client side before accessing the window object
    if (typeof window !== 'undefined') {
      // Add an event listener for window resize
      window.addEventListener('resize', updateWindowDimensions);

      // Initial window dimensions
      updateWindowDimensions();

      // Cleanup the event listener when the component unmounts
      return () => {
        window.removeEventListener('resize', updateWindowDimensions);
      };
    }
  }, [screenSize]);

  return isBelow767px;
};

export default UseScreenSize;
