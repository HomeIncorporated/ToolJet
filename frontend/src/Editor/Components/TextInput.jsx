import React, { useEffect, useRef, useState } from 'react';
import { resolveReferences } from '@/_helpers/utils';
import { useCurrentState } from '@/_stores/currentStateStore';
import { ToolTip } from '@/_components/ToolTip';

export const TextInput = function TextInput({
  height,
  validate,
  properties,
  styles,
  setExposedVariable,
  fireEvent,
  component,
  darkMode,
  dataCy,
}) {
  const textInputRef = useRef();
  console.log('styles---', styles);

  const [disable, setDisable] = useState(properties.disabledState);
  const [value, setValue] = useState(properties.value);
  const [visibility, setVisibility] = useState(properties.visibility);
  const { isValid, validationError } = validate(value);
  const [showValidationError, setShowValidationError] = useState(false);
  const currentState = useCurrentState();

  const isMandatory = resolveReferences(component?.definition?.validation?.mandatory?.value, currentState);
  const computedStyles = {
    height: height,
    borderRadius: `${styles.borderRadius}px`,
    color: darkMode && styles.textColor === '#000' ? '#fff' : styles.textColor,
    borderColor: styles.borderColor,
    backgroundColor: darkMode && ['#fff'].includes(styles.backgroundColor) ? '#232e3c' : styles.backgroundColor,
    boxShadow: styles.boxShadow,
  };
  const { loadingState } = properties;

  useEffect(() => {
    disable !== properties.disabledState && setDisable(properties.disabledState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties.disabledState]);

  useEffect(() => {
    visibility !== properties.visibility && setVisibility(properties.visibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties.visibility]);

  useEffect(() => {
    setExposedVariable('isValid', isValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid]);

  useEffect(() => {
    setValue(properties.value);
    setExposedVariable('value', properties.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties.value]);

  useEffect(() => {
    setExposedVariable('setFocus', async function () {
      textInputRef.current.focus();
    });
    setExposedVariable('setBlur', async function () {
      textInputRef.current.blur();
    });
    setExposedVariable('disable', async function (value) {
      setDisable(value);
    });
    setExposedVariable('visibility', async function (value) {
      setVisibility(value);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setExposedVariable('setText', async function (text) {
      setValue(text);
      setExposedVariable('value', text).then(fireEvent('onChange'));
    });
    setExposedVariable('clear', async function () {
      setValue('');
      setExposedVariable('value', '').then(fireEvent('onChange'));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue]);

  return (
    <>
      {loadingState === true && (
        <div className="d-flex align-items-center justify-content-center" style={{ width: '100%', height }}>
          <center>
            <div className="spinner-border" role="status"></div>
          </center>
        </div>
      )}
      {!loadingState && (
        <ToolTip message={properties.toolltip && properties.toolltip}>
          <div
            data-disabled={disable}
            className={`text-input d-flex ${styles.alignment == 'top' && 'flex-column'}  ${
              styles.direction == 'alignrightinspector' && styles.alignment == 'side' && 'flex-row-reverse'
            }
      ${styles.direction == 'alignrightinspector' && styles.alignment == 'top' && 'text-right'}
      ${visibility || 'invisible'}`}
            style={{ height: height }}
          >
            <label
              style={{
                color: darkMode && styles.color == '#11181C' ? '#fff' : styles.color,
                width: styles.auto ? 'auto' : styles.alignment == 'side' ? `${styles.width}%` : '100%',
                maxWidth: styles.auto && styles.alignment == 'side' ? '70%' : '100%',
                lineBreak: styles.auto == false && 'anywhere',
                marginRight: styles.direction == 'alignleftinspector' && styles.alignment == 'side' && '9px',
                marginLeft: styles.direction == 'alignrightinspector' && styles.alignment == 'side' && '9px',
              }}
            >
              {properties.label}
              <span style={{ color: '#DB4324', marginLeft: '1px' }}>{isMandatory && '*'}</span>
            </label>
            <input
              ref={textInputRef}
              onKeyUp={(e) => {
                if (e.key == 'Enter') {
                  setValue(e.target.value);
                  setExposedVariable('value', e.target.value);
                  fireEvent('onEnterPressed');
                }
              }}
              onChange={(e) => {
                setValue(e.target.value);
                setExposedVariable('value', e.target.value);
                fireEvent('onChange');
              }}
              onBlur={(e) => {
                setShowValidationError(true);
                e.stopPropagation();
                fireEvent('onBlur');
              }}
              onFocus={(e) => {
                e.stopPropagation();
                fireEvent('onFocus');
              }}
              type="text"
              className={`form-control ${!isValid ? 'is-invalid' : ''} validation-without-icon ${
                darkMode && 'dark-theme-placeholder'
              }`}
              placeholder={properties.placeholder}
              style={computedStyles}
              value={value}
              data-cy={dataCy}
            />
            <div
              className="invalid-feedback"
              data-cy={`${String(component.name).toLowerCase()}-invalid-feedback`}
              style={{ color: styles.errTextColor }}
            >
              {showValidationError && validationError}
            </div>
          </div>
        </ToolTip>
      )}
    </>
  );
};
