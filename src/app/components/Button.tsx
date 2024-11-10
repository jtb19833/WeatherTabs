const Button = (props: any) => {
    return (
      <button className={props.buttonStyle}
        type={props.type || 'button'}
        onClick={props.onClick}
      >
        {props.children}
      </button>
    );
  };
  
  export default Button;