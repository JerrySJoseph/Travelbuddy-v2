import { Modal, MantineSize, Divider } from "@mantine/core";
import React, { HTMLProps, createContext, useContext, useState } from "react";

export interface ModalProps {
    title?: string,
    size?: MantineSize,
    content?: React.ReactNode,
    centered?: boolean
}

interface IModalContext {
    open: boolean,
    modalProps: ModalProps,
    openModal: (props: ModalProps) => any
    closeModal: () => any
}

const defaultModalProps: ModalProps = {
    centered: true,
    title: '',
    content: <></>,
    size: 'md'
}
const defaultModalContext: IModalContext = {
    open: false,
    modalProps: {
        centered: true,
        title: '',
        content: <></>,
        size: 'md'
    },
    openModal: () => { },
    closeModal: () => { }
}

const ModalContext = createContext<IModalContext>(defaultModalContext)

interface IModalContextProviderProps {
    children?: React.ReactNode
    [key: string]: any
}

const ModalContextProvider = ({ children }: IModalContextProviderProps) => {

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [props, setProps] = useState<ModalProps>(defaultModalProps)

    const value: IModalContext = {
        open: isOpen,
        modalProps: props,
        openModal(props) {
            setProps({ ...defaultModalProps, ...props })
            setIsOpen(true)
        },
        closeModal() {
            setIsOpen(false)
        },
    }

    return <ModalContext.Provider value={value}>
        {children}
        <Modal opened={isOpen} onClose={() => { setIsOpen(false) }} title={props.title} size={props.size} centered>
            <Modal.Title>
                <Divider mb='lg' />
            </Modal.Title>
            {props.content}
        </Modal>
    </ModalContext.Provider>
}

export default ModalContextProvider;

export const useModal = () => useContext(ModalContext);