import "styles/ui/Button.scss";

export const Button = props => (
  <button
    {...props}
    style={{width: props.width, ...props.style}}
    className={`primary-button ${props.className}`}>
    {props.children}
  </button>
);

export const Button2 = props => (
  <button
    {...props}
    style={{width: props.width, ...props.style}}
    className={`primary-button2 ${props.className}`}>
    {props.children}
  </button>
);
