export interface SignUp {
    name: string,
    email: string,
    password: string,
    walletaddress: string
}

export interface Login {
    email: string,
    password: string,
    walletaddress: string
}

export interface Owner {
    owner: string[]
}