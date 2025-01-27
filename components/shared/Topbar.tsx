
import Image from "next/image";
import Link from "next/link";
import projectInfo from "../../CustomizingPlatform/information.json"

function Topbar() {
  return (
    <nav className='topbar'>
      <Link href='/' className='flex items-center gap-4'>
      <Image src="/logo.png" width={28} height={28} alt="Logo" />
        <p className='text-heading3 text-light-1 max-xs:hidden'>{projectInfo.name}</p>
      </Link>

      <div className='flex items-center gap-1'>
      </div>

    </nav>
  );
}

export default Topbar;