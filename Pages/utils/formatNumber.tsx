export function formatWithSubscripts(number: number): string {
  const subscripts = "₀₁₂₃₄₅₆₇₈₉";

  const numberStr = number.toFixed(20);
  const [integerPart, decimalPart = ""] = numberStr.split(".");

  let leadingZeros = 0;
  while (
    leadingZeros < decimalPart.length &&
    decimalPart[leadingZeros] === "0"
  ) {
    leadingZeros++;
  }

  let significantDigits = decimalPart.slice(leadingZeros, leadingZeros + 5); // Limit to 5 decimal places
  let lastNonZeroIndex = significantDigits.length - 1;
  while (lastNonZeroIndex >= 0 && significantDigits[lastNonZeroIndex] === "0") {
    lastNonZeroIndex--;
  }
  significantDigits = significantDigits.slice(0, lastNonZeroIndex + 1);

  // Limit the significant digits to 4
  significantDigits = significantDigits.slice(0, 4);

  let result = "0.0";

  if (leadingZeros > 0) {
    result += leadingZeros
      .toString()
      .split("")
      .map((char) => subscripts[parseInt(char)])
      .join("");
  }

  result += significantDigits;

  return result;
}

// Function to format numbers in various formats
export const formatNumber = (
  number: any,
  decimals = 2,
  chunk = false,
  percentage = false,
  dollar = false,
  price = false,
  tooltip = false,
  fullDecimal = false,
): string | null => {
  if (number === "" || number == null || Number.isNaN(number)) {
    return null;
  }

  const subscripts = "₀₁₂₃₄₅₆₇₈₉";
  let formattedNumber: string;

  const absNumber = Math.abs(number);
  const limitDecimals = (num: number, dec: number) =>
    num?.toFixed(Math.min(dec, 5));

  // Check for small numbers that require subscript notation
  if (absNumber > 0 && absNumber < 0.01) {
    const numberStr = number?.toString();

    if (numberStr && numberStr.includes("e-")) {
      // Handle scientific notation numbers

      const [coefficient, exponent] = numberStr?.split("e-");
      const expNumber = parseInt(exponent);
      const coefDigitsAfterDecimal = coefficient?.split(".")[1]?.length || 0;
      const totalZeroes = expNumber - coefDigitsAfterDecimal;

      let significantDigits = coefficient
        ?.replace(/^0\./, "")
        ?.replace(".", "")
        ?.slice(0, 4);

      let result = "0.0";

      if (totalZeroes > 0) {
        result += totalZeroes
          .toString()
          .split("")
          .map((char) => subscripts[parseInt(char)])
          .join("");
      }

      result += significantDigits;
      return result;
    } else {
      // Handle non-scientific notation small numbers
      const decimalPart = numberStr?.split(".")[1] || "";
      const leadingZeros = decimalPart?.match(/^0*/)?.[0]?.length ?? 0;

      let significantDigits = decimalPart
        ?.slice(leadingZeros)
        ?.replace(/^0*/, "")
        ?.slice(0, 4);

      let result = "0.0";

      if (leadingZeros > 0) {
        result += leadingZeros
          .toString()
          .split("")
          .map((char: any) => subscripts[parseInt(char)])
          .join("");
      }

      result += significantDigits;
      return result;
    }
  } else {
    formattedNumber = limitDecimals(Number(number), decimals);
  }

  if (percentage) {
    return formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "%";
  }

  if (chunk) {
    let suffix = "";
    if (number >= 1000000000000) {
      formattedNumber = limitDecimals(number / 1000000000000, decimals);
      suffix = "T";
    } else if (number >= 1000000000) {
      formattedNumber = limitDecimals(number / 1000000000, decimals);
      suffix = "B";
    } else if (number >= 1000000) {
      formattedNumber = limitDecimals(number / 1000000, decimals);
      suffix = "M";
    } else if (number >= 1000) {
      formattedNumber = limitDecimals(number / 1000, decimals);
      suffix = "K";
    }

    if (dollar) {
      return `$${formattedNumber}${suffix}`;
    } else {
      return `${formattedNumber}${suffix}`;
    }
  }

  if (dollar) {
    formattedNumber = formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return "$" + formattedNumber;
  }

  if (formattedNumber.includes(".")) {
    const [wholeNumber, decimalPart] = formattedNumber.split(".");
    return (
      wholeNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
      "." +
      decimalPart.padEnd(decimals, "0")
    );
  }

  return formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export function handleTableValues(
  value: any,
  sign: string | number,
  tooltip: boolean = false,
) {
  let number: any = 0;

  if (value === 0.0 || value === null) {
    number = 0;
  } else if (tooltip) {
    number = Number(value).toFixed(8);
  } else if (value < 1) {
    const decimalPart = value.toString().split(".")[1] || "";
    const leadingZeros = decimalPart.match(/^0*/)[0].length;
    const decimalPlaces = decimalPart.length;

    if (leadingZeros > 2 && decimalPlaces > 2) {
      number = formatWithSubscripts(value);
    } else {
      number = formatNumber(value, 4);
    }
  } else {
    number = formatNumber(value, 2);
  }

  if (sign === "$" && value !== 0) {
    number = `$${number}`;
  } else if (sign === "%" && value !== 0) {
    number = `${number}%`;
  }

  return number;
}

export function convertToShortNum(value: number) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    notation: "compact",
    currency: "USD",
    compactDisplay: "short",
    maximumFractionDigits: 2,
  }).format(value);
}

export const convertLowNumber = (str: string) => {
  const count = str.split("0").length - 2;
  const val = {
    count: count,
    value: str.split("0")[count + 1],
  };
  return val;
};

export function customFormatting(
  inputNumber: number,
  isCurrency: boolean,
  decimalPlaces: number,
) {
  // Check if the number is greater than 2 digits before the decimal point
  if (inputNumber >= 100) {
    const currencyString = inputNumber.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: decimalPlaces,
    });
    return isCurrency
      ? currencyString
      : inputNumber.toFixed(decimalPlaces) + "%";
  } else {
    // Format as percentage
    return isCurrency
      ? inputNumber.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })
      : inputNumber.toFixed(decimalPlaces) + "%";
  }
}

export const getPercentageChange = (oldValue: number, newValue: number) => {
  if (oldValue === 0) return "+0%";

  const percentageChange = ((newValue - oldValue) / oldValue) * 100;
  const formattedChange = percentageChange.toFixed(2);

  return (percentageChange >= 0 ? "+" : "") + formattedChange + "%";
};
