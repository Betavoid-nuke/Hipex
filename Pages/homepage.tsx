'use client';

import CDCard from '@/components/cards/CDCard';
import { fetchUserCountdowns } from '@/lib/actions/user.action';
import { useEffect, useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton"


export default function Dash() {
  const [countdowns, setCountdowns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCountdowns = async () => {
      try {
        const data = await fetchUserCountdowns();
        setCountdowns(data);
      } catch (error) {
        console.error('Failed to fetch countdowns:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCountdowns();
  }, []);

  return (
    <div className="p-6" style={{ background: 'transparent'}} >
      {loading ? (
        <div className="flex gap-6 flex-wrap">
          <div className="flex flex-col space-y-3" style={{width:"260px"}}>
            <Skeleton className="h-[125px] w-[250px] rounded-xl" style={{height:'120px'}} />
          </div>
          <div className="flex flex-col space-y-3" style={{width:"260px"}}>
            <Skeleton className="h-[125px] w-[250px] rounded-xl" style={{height:'120px'}} />
          </div>
          <div className="flex flex-col space-y-3" style={{width:"260px"}}>
            <Skeleton className="h-[125px] w-[250px] rounded-xl" style={{height:'120px'}} />
          </div>
          <div className="flex flex-col space-y-3" style={{width:"260px"}}>
            <Skeleton className="h-[125px] w-[250px] rounded-xl" style={{height:'120px'}} />
          </div>
          <div className="flex flex-col space-y-3" style={{width:"260px"}}>
            <Skeleton className="h-[125px] w-[250px] rounded-xl" style={{height:'120px'}} />
          </div>
          <div className="flex flex-col space-y-3" style={{width:"260px"}}>
            <Skeleton className="h-[125px] w-[250px] rounded-xl" style={{height:'120px'}} />
          </div>
          <div className="flex flex-col space-y-3" style={{width:"260px"}}>
            <Skeleton className="h-[125px] w-[250px] rounded-xl" style={{height:'120px'}} />
          </div>
          <div className="flex flex-col space-y-3" style={{width:"260px"}}>
            <Skeleton className="h-[125px] w-[250px] rounded-xl" style={{height:'120px'}} />
          </div>
          <div className="flex flex-col space-y-3" style={{width:"260px"}}>
            <Skeleton className="h-[125px] w-[250px] rounded-xl" style={{height:'120px'}} />
          </div>
          <div className="flex flex-col space-y-3" style={{width:"260px"}}>
            <Skeleton className="h-[125px] w-[250px] rounded-xl" style={{height:'120px'}} />
          </div>
          <div className="flex flex-col space-y-3" style={{width:"260px"}}>
            <Skeleton className="h-[125px] w-[250px] rounded-xl" style={{height:'120px'}} />
          </div>
          <div className="flex flex-col space-y-3" style={{width:"260px"}}>
            <Skeleton className="h-[125px] w-[250px] rounded-xl" style={{height:'120px'}} />
          </div>
        </div>
      ) : countdowns.length === 0 ? (
        <p className="text-gray-500">No countdowns found.</p>
      ) : (
        <div className="flex gap-6 flex-wrap" style={{justifyContent:'center'}}>
          {countdowns.slice().reverse().map((cd, index) => (
            <CDCard key={cd._id} {...cd} 
            name={cd.CDname}
            description={cd.CDDescription}
            timeend={cd.time.toString()}
            id={cd._id}
            PublishedName={cd.PublishedName}
            loopint={index}
            projectType={cd.projectType}/>
          ))}
        </div>
      )}
    </div>
  );
}





// {countdowns.length === 0 ? (
//     <p className="text-gray-500">No countdowns found.</p>
//   ) : (
//     <div className="flex gap-6 flex-wrap">
//       {countdowns.map((cd: any) => (
//         <div
//           key={cd._id}
//           className="border p-4 rounded-lg shadow bg-white w-[280px]"
//         >
//           <h2 className="text-lg font-semibold">{cd.CDname}</h2>
//           <p className="text-sm text-gray-600 truncate">{cd.CDDescription}</p>
//           <p className="text-sm text-gray-400 mb-2">
//             Countdown End: {new Date(cd.time).toLocaleString()}
//           </p>

//           <Input
//             type="text"
//             value={cd.CDlink}
//             readOnly
//             className="mb-2 text-sm cursor-text"
//             onFocus={(e) => e.target.select()}
//           />

//           <Button
//             asChild
//             variant="outline"
//             className="w-full"
//           >
//             <a
//               href={cd.CDlink}
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               Open Event Link
//             </a>
//           </Button>
//         </div>
//       ))}
//     </div>
//   )}