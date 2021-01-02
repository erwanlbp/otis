export interface Counter {
    name: string;
    value: number;
    lastEventTs: number;
    /** Default to true, so if null in DB, then is true */
    areAtomicButtonsActive: boolean;
}


export interface CounterFirebaseDto {
    name: string;
    value: number;
    lastEventTs: number;
    areAtomicButtonsActive?: boolean;
}

export function toCounter(counterDto: CounterFirebaseDto): Counter | null {
    if (!counterDto) {
        return null;
    }
    return {
        name: counterDto.name,
        value: counterDto.value,
        lastEventTs: counterDto.lastEventTs,
        areAtomicButtonsActive: counterDto.areAtomicButtonsActive === undefined || counterDto.areAtomicButtonsActive === null ? true : counterDto.areAtomicButtonsActive,
    };
}

export function toCounterDto(counter: Counter): CounterFirebaseDto | null {
    if (!counter) {
        return null;
    }
    return {
        name: counter.name,
        value: counter.value,
        lastEventTs: counter.lastEventTs,
        areAtomicButtonsActive: counter.areAtomicButtonsActive,
    };
}
