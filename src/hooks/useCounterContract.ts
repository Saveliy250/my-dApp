import { useEffect, useState } from 'react';
import Counter from '../contracts/counter';
import { useTonClient } from './useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { Address, OpenedContract } from '@ton/core';

export function useCounterContract() {
    const client = useTonClient();
    const [val, setVal] = useState<null | number>();

    const counterContract = useAsyncInitialize(async () => {
        if (!client) return;
        const contract = new Counter(
            Address.parse('EQA2-Cxv1m6LcdtnFNpHYQm5Dd8scyX2h2Qe-5OYLp2X9Bi6')
        );
        return client.open(contract) as OpenedContract<Counter>;
    }, [client]);

    useEffect(() => {
        async function getValue() {
            if (!counterContract) return;
            setVal(null);
            const val = await counterContract.getCounter();
            setVal(Number(val));
        }
        getValue();
    }, [counterContract]);

    return {
        value: val,
        address: counterContract?.address.toString(),
    };
}