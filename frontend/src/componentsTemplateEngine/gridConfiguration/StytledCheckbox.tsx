import { Checkbox, CheckboxProps } from '@headlessui/react';
import { FC } from 'react';

const StyledCheckbox: FC<CheckboxProps> = ({ checked, onChange }) => {
    return (
        <>
            <Checkbox
                checked={checked}
                onChange={onChange}
                className="
                  group block rounded size-5 
                  border-2 bg-white border-gray-light 

                  focus:ring-offset-0 focus:ring-0 

                  hover:border-gray-dark 
                  hover:bg-white 

                  focus:border-gray-dark 
                  focus:bg-white

                  active:border-gray-dark 
                  active:bg-gray 

                  data-[checked]::border-0 
                  data-[checked]:bg-gray 

                  checked:hover:border-0 
                  checked:hover:bg-gray 

                  checked:focus:border-0 
                  checked:focus:bg-gray

                  checked:active:border-0
                  checked:active:bg-gray

                  data-[disabled]:cursor-not-allowed 
                  data-[disabled]:opacity-50 
                  data-[checked]:data-[disabled]:bg-gray-500 mb-3"
            >
                <svg
                    className="stroke-white opacity-0 group-data-[checked]:opacity-100"
                    viewBox="0 0 14 14"
                    fill="none"
                >
                    <path
                        d="M3 8L6 11L11 3.5"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </Checkbox>
        </>
    );
};

export default StyledCheckbox;
