import { TextStyles } from "@/theme";
import { SuccessToast } from "react-native-toast-message";

export const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props) => (
    <SuccessToast
      {...props}
      text1NumberOfLines={0}
      text2NumberOfLines={0}
      style={{
        borderLeftColor: "green",
        height: "auto",
        paddingVertical: 5,
        minHeight: 60,
      }}
      text1Style={TextStyles.label}
      text2Style={TextStyles.text}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props) => (
    <ErrorToast
      {...props}
      text1NumberOfLines={0}
      text2NumberOfLines={0}
      text1Style={TextStyles.label}
      text2Style={TextStyles.text}
      style={{
        borderLeftColor: "red",
        height: "auto",
        paddingVertical: 5,
        minHeight: 60,
      }}
    />
  ),
};
