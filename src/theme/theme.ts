interface Color {
  Black: string;
  LightGray: string;
  LightGray2: string;
}

export const COLORS: Color = {
  Black: '#212121',
  LightGray: '#ACB9C7',
  LightGray2: '#F9FAFC',
};

//   interface FontFamily {
//     poppins_black: string;
//     poppins_bold: string;
//     poppins_extrabold: string;
//     poppins_extralight: string;
//     poppins_light: string;
//     poppins_medium: string;
//     poppins_regular: string;
//     poppins_semibold: string;
//     poppins_thin: string;
//   }

//   export const FONTFAMILY: FontFamily = {
//     poppins_black: 'Poppins_Black',
//     poppins_bold: 'Poppins-Bold',
//     poppins_extrabold: 'Poppins-ExtraBold',
//     poppins_extralight: 'Poppins-ExtraLight',
//     poppins_light: 'Poppins-Light',
//     poppins_medium: 'Poppins-Medium',
//     poppins_regular: 'Poppins-Regular',
//     poppins_semibold: 'Poppins-SemiBold',
//     poppins_thin: 'Poppins-Thin',
//   };

interface FontSize {
  xxs: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  title: number;
}

export const FONTSIZE: FontSize = {
  xxs: 8,
  xs: 10,
  sm: 12,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 22,
  title: 26,
};

interface BorderRadius {
  radius_14: number;
}

export const BORDERRADIUS: BorderRadius = {
  radius_14: 14,
};

interface FontWeight {
  300: number;
  400: number;
  500: number;
  600: number;
  700: number;
  900: number;
}

export const FONTWEIGHT: FontWeight = {
  300: 300,
  400: 400,
  500: 500,
  600: 600,
  700: 700,
  900: 900,
};
