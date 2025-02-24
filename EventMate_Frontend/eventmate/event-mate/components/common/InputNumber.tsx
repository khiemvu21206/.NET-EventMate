import React, { ChangeEvent, ChangeEventHandler, KeyboardEventHandler, useState } from 'react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { isNil, round } from 'lodash';

type Props = {
    id?: string;
    disable?: boolean;
    className?: string;
    placeholder?: string;
    defaultValue?: number;
    onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
    step?: number;
    max?: number;
    min?: number;
    value?: number | string;
    onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
    showControlButtons?: boolean;
    // Allow input decimal number
    allowDecimal?: boolean;
    // Number of value after radix
    radix?: number;
};

const EXCLUDE_INTEGER_PATTERN = /^(?!-?\d*\.?\d+)$/g;
const VALID_CHARACTER = ['', '-'];

export const InputNumber: React.FC<Props> = ({
    onChange,
    placeholder,
    defaultValue,
    className,
    disable,
    step,
    max,
    min,
    id,
    value,
    onKeyDown,
    showControlButtons,
    allowDecimal,
    radix = 2,
}) => {
    const [valid, setValid] = useState(true);

    const isValidCharacter = (value: string) => {
        return VALID_CHARACTER.includes(value);
    };

    const isValidDecimal = (value: string, radix: number) => {
        const [integerPart, decimalPart] = value.split('.');
        return (
            !integerPart.match(/[^0-9.-]+/g) &&
            value.split('.').length <= 2 &&
            (!decimalPart || decimalPart.length <= radix)
        );
    };

    const isValidNumber = (valueStr: string) => {
        const minValue = (min && min > 0 ? min : 0).toString();
        const regex = new RegExp(/^-?\d*\.?\d+(e-?\d+)?$/);
        let isValid = regex.test(valueStr);

        if (isValid) {
            const floatValue = parseFloat(valueStr || minValue);
            if (max != undefined && max != null && floatValue > max) isValid = false;
            if (min != undefined && min != null && floatValue < min) isValid = false;
        }

        return isValid;
    };

    const formatValue = (value: string, minValue: string) => {
        const [integerPart, decimalPart] = value.split('.');

        const formattedIntValue = integerPart.replace(EXCLUDE_INTEGER_PATTERN, '') || minValue;

        if (!isValidNumber(value)) {
            return '';
        }

        const formattedValue =
            decimalPart || value.split('.').length === 2
                ? `${formattedIntValue}.${decimalPart}`
                : formattedIntValue;

        return (+formattedValue).toString();
    };

    const isDecimalEnd = (value: string) => {
        return value.endsWith('.') && value.match(/\./g)?.length === 1;
    };

    const onChangeValueInput = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const minValue = (min && min > 0 ? min : 0).toString();

        if (isValidCharacter(value)) {
            event.target.value = value;
            setValid(false);
            onChange?.(event);
            return;
        }

        if (allowDecimal) {
            if (isDecimalEnd(value)) {
                event.target.value = value;
                setValid(false);
                onChange?.(event);
                return;
            }
        }

        if (!isValidDecimal(value, radix)) {
            event.preventDefault();
            return;
        }

        const formattedValue = formatValue(value, minValue);

        if (!formattedValue) {
            setValid(false);
            event.preventDefault();
            return;
        }

        setValid(true);
        onChange?.(event);
    };

    const onStepChange = (step: number) => {
        if (isNil(value)) return;
        const newValue = round(+value + step, 2);
        onChangeValueInput({
            target: { value: newValue.toString() },
        } as ChangeEvent<HTMLInputElement>);
    };

    const handleBlur = (event: ChangeEvent<HTMLInputElement>) => {
        const minValue = (min && min > 0 ? min : 0).toString();
        const isValid = isValidNumber(event.target.value);

        if (!isValid) {
            event.target.value = minValue;
            setValid(true);
            onChange?.(event);
        }
    };

    // show inc, dec button if step, max, min not nil and showControlButtons = true
    const isControlButtonShown = !isNil(step) && !isNil(max) && !isNil(min) && showControlButtons;

    const Input = (
        <input
            id={id || `input-number-${new Date().getTime()}`}
            type="text"
            defaultValue={defaultValue}
            placeholder={placeholder}
            onChange={onChangeValueInput}
            onBlur={handleBlur}
            className={`input-number-common ${!valid && 'invalid'} ${
                className || 'm-1 p-1 border rounded-lg border-primary-500'
            } ${disable ? 'bg-gray-100' : ''}`}
            value={value}
            onKeyDown={onKeyDown}
        />
    );

    // return Input if not showControlButtons
    if (!isControlButtonShown) return Input;

    // Handle Input with inc, dec button
    const isDecButtonEnabled = isControlButtonShown && !isNil(value) && Number(value) > min;
    const isIncButtonEnabled = isControlButtonShown && !isNil(value) && Number(value) < max;

    return (
        <div className="flex flex-row w-full items-center gap-3 justify-center">
            <MinusIcon
                className={`w-5 h-5 stroke-2 ${
                    isDecButtonEnabled
                        ? 'stroke-primary-800  cursor-pointer'
                        : 'stroke-primary-50 dark:stroke-slate-700 cursor-not-allowed'
                }`}
                onClick={() => isDecButtonEnabled && onStepChange(-(step || 1))}
            />
            {Input}
            <PlusIcon
                className={`w-5 h-5 stroke-2 ${
                    isIncButtonEnabled
                        ? 'stroke-primary-800  cursor-pointer'
                        : 'stroke-primary-50 dark:stroke-slate-700 cursor-not-allowed'
                }`}
                onClick={() => isIncButtonEnabled && onStepChange(step || 1)}
            />
        </div>
    );
};
