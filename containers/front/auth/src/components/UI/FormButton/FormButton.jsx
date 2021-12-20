import classnames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { CheckIcon, SpinnerIcon } from '../Icons/Icons';
import './FormButton.scss';
//import { defaultFormButtonProps, FormButtonProps } from './types/FormButtonProps';

const FormButton = (props) => {
  const {
    buttonClass,
    buttonLabel,
    buttonSize,
    buttonType,
    buttonValue,
    clickHandler,
    forceShowLabel,
    isCompleted,
    isDisabled,
    isLoading,
  } = props;

  const buttonRef = useRef<HTMLButtonElement>(null);
  const [buttonWidth, setButtonWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!isCompleted && !isLoading && buttonRef.current) {
      const { width } = buttonRef.current.getBoundingClientRect();
      setButtonWidth(width);
    }
  }, [isCompleted, isLoading]);

  const btnClass = classnames(
    'form-button',
    {
      '-forceShowLabel': forceShowLabel,
      completed: isCompleted,
      pending: isLoading,
    },
    buttonClass,
    buttonSize
  );
  const style = !forceShowLabel && (isCompleted || isLoading) ? { width: buttonWidth } : undefined;
  const valueToPass = buttonValue || buttonLabel;

  return (
    <button
      ref={buttonRef}
      className={btnClass}
      disabled={isDisabled || isLoading}
      onClick={(e) => clickHandler && clickHandler(valueToPass, e)}
      style={style}
      type={buttonType}
    >
      <CheckIcon />
      {isLoading && <SpinnerIcon />}
      {(forceShowLabel || (!isLoading && !isCompleted)) && buttonLabel}
    </button>
  );
};

FormButton.defaultProps = defaultFormButtonProps();

export default FormButton;