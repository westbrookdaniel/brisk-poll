import logo from "../images/Logo.svg";

export default function Logo(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img src={logo} alt="Logo" {...props} />;
}
