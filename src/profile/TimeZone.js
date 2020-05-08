import TimezonePicker from 'react-timezone';
import React from 'react';

export default () => (
    <TimezonePicker style={{ padding: '0% 3%',width:'300px'}}
        value="Asia/Yerevan"
        inputProps ={{
            placeholder:'timezone 입력',
            name: 'timezone',
        }}
    />
);