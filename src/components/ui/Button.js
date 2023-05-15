import "styles/ui/Button.scss";
import { Button as Btn } from "@mui/material";

export const Button = (props) => (
    <button
        {...props}
        style={{ width: props.width, ...props.style }}
        variant="contained"
        className={`primary-button ${props.className}`}
    >
        {props.children}
    </button>
);

export const Button2 = (props) => (
    <button
        {...props}
        style={{ width: props.width, ...props.style }}
        variant="contained"
        className={`primary-button2 ${props.className}`}
    >
        {props.children}
    </button>
);
