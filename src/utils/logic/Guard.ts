/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IGuardResult {
    isSuccess: boolean;
    failedOn?: string;
}

export interface IGuardArgument {
    argument: any;
    argumentName: string;
}

type GuardArgumentCollection = IGuardArgument[];

export class Guard {
    public static againstNullOrUndefined(argument: any, argumentName?: string): IGuardResult {
        if (argument !== null && argument !== undefined) 
            return { isSuccess: true };
        
        return { isSuccess: false, failedOn: argumentName };
    }

    public static againstNullOrUndefinedCollection(args: GuardArgumentCollection): IGuardResult {
        for (const { argument, argumentName } of args) {
            if (!this.againstNullOrUndefined(argument))
                return { isSuccess: false, failedOn: argumentName };
        }

        return { isSuccess: true, failedOn: '' }
    }
}