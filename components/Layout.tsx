import { classNames } from "@hkamran/utility-web";

const Layout = ({
    width,
    className,
    children,
}: {
    width?: string;
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <div
            className={classNames(
                "h-screen flex flex-col px-12 mx-auto",
                width ? width : "max-w-2xl",
            )}
        >
            <div className="grow py-12 flex flex-col">
                <div
                    className={classNames(
                        "my-auto",
                        className && className.indexOf("space-y-") !== -1
                            ? ""
                            : "space-y-10",
                        className ? className : "",
                    )}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
