import * as React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useBoolean } from "~/utils";

type RenderFunction = (
  openModal: () => void,
  closeModal: () => void
) => React.ReactNode;

interface Props {
  title?: string;
  description?: string;
  body?: React.ReactNode | RenderFunction;
  children?: RenderFunction;
  isOpen?: boolean;
}

export function Modal({
  title,
  description,
  children,
  body,
  isOpen: externalIsOpen,
}: Props) {
  const [isOpen, setIsOpen] = useBoolean(false);

  return (
    <>
      {typeof children === "function"
        ? children(setIsOpen.on, setIsOpen.off)
        : children}

      <Transition appear show={externalIsOpen || isOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={setIsOpen.off}
        >
          <div className="flex items-center justify-center min-h-screen px-4">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="flex flex-col items-start w-full max-w-md p-6 my-8 overflow-hidden text-left bg-white rounded-lg shadow-xl transform space-y-4 transition-all">
                <div className="space-y-1">
                  <Dialog.Title as="h3" className="text-xl leading-6">
                    {title}
                  </Dialog.Title>

                  <Dialog.Description className="text-gray-500 text-md leading-6">
                    {description}
                  </Dialog.Description>
                </div>

                {typeof body === "function"
                  ? body(setIsOpen.on, setIsOpen.off)
                  : body}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
