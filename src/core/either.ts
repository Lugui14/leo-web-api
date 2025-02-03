export class Left<L> {
    readonly value: L;

    constructor(value: L) {
        this.value = value;
    }

    isLeft(): this is Left<L> {
        return true;
    }

    isRight(): this is Right<never> {
        return false;
    }

    // eslint-disable-next-line
    fold<T>(onLeft: (left: L) => T, onRight: (right: never) => T): T {
        return onLeft(this.value);
    }
}

export class Right<R> {
    readonly value: R;

    constructor(value: R) {
        this.value = value;
    }

    isLeft(): this is Left<never> {
        return false;
    }

    isRight(): this is Right<R> {
        return true;
    }

    fold<T>(onLeft: (left: never) => T, onRight: (right: R) => T): T {
        return onRight(this.value);
    }
}

export type Either<L, R> = Left<L> | Right<R>;

export const left = <L, R>(value: L): Either<L, R> => new Left(value);
export const right = <L, R>(value: R): Either<L, R> => new Right(value);
