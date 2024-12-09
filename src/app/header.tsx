import Link from "next/link";

export default function Header(){
    return (
        <header>
            <Link href="/">
                <h1>EverySim Week1</h1>
            </Link>
        </header>
    );
}