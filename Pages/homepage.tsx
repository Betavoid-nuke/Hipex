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


  // Function to update the countdowns state after deletion
  // This will remove the card with the given CDID from the state
  const updateCards = async (CDID: string) => {
    try {

      setCountdowns(prev => prev.filter(cd => cd._id !== CDID));
      console.log('updated');

    } catch (err: any) {
      console.error("Delete error:", err.message);
    }
  };


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
            projectType={cd.projectType}
            published={cd.published}
            onDelete={() => updateCards(cd._id)}
          />
          ))}
        </div>
      )}
    </div>
  );
}




