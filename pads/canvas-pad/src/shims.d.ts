//
// Copyright 2020 DxOS, Inc.
//

declare module '@dxos/gem-canvas';
declare module '@dxos/react-client' {
    type Instance<T> = T extends { new (...args: any): infer U } ? U : never

    declare function useModel<T>(opts: {
      model: T,
      options: {
        type?: string | string[]
        topic?: string
        [key: string]: any
      }
    }): Instance<T> | null
}
