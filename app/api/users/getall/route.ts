import User from "@/lib/models/user.model";
import { connectToDB } from "@/lib/mongoose";
import { NextResponse } from "next/server";

//gets user by keywords
export async function GET(req: Request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const searchKey = searchParams.get("searchkey")?.trim();

    let users;

    if (searchKey && searchKey.length > 0) {
      const regex = new RegExp(searchKey, "i"); // case-insensitive regex

      users = await User.find({
        $or: [
          // --- Core user fields ---
          { username: regex },
          { name: regex },
          { email: regex },
          { bio: regex },
          { country: regex },
          { oneSentanceIntro: regex },

          // --- Tags array ---
          { tags: { $elemMatch: { $regex: regex } } },

          // --- Social handles ---
          { "socialhandles.platform": regex },
          { "socialhandles.url": regex },

          // --- Jobs (array of objects) ---
          { "jobs.title": regex },
          { "jobs.company": regex },
          { "jobs.description": regex },

          // --- Optional fields that might exist ---
          { "education.school": regex },
          { "education.degree": regex },
          { "education.field": regex },

          // --- If you ever store meta fields ---
          { "meta.keywords": regex },
          { "meta.description": regex },
        ],
      }).lean();
    } else {
      users = await User.find({}).lean();
    }

    return NextResponse.json({ users }, { status: 200 });
  } catch (err) {
    console.error("❌ Failed to fetch users:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


//usage - 
  // const [searchKey, setSearchKey] = useState("");

  // useEffect(() => {
  //   const controller = new AbortController();

  //   const fetchUsers = async () => {
  //     try {
  //       setIsLoading(true);

  //       const query = searchKey ? `?searchkey=${encodeURIComponent(searchKey)}` : "";
  //       const res = await fetch(`/api/users/getall${query}`, {
  //         method: "GET",
  //         signal: controller.signal,
  //       });

  //       if (!res.ok) throw new Error("Failed to fetch users");

  //       const data = await res.json();
  //       setAllUsers(data.users || []);
  //       setSearchResults(data.users || []);
  //     } catch (err) {
  //       console.log(err);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchUsers();

  //   // Cleanup in case user types fast
  //   return () => controller.abort();
  // }, [searchKey]);

  // <input
  //   type="text"
  //   value={searchQuery}
  //   onChange={(e) => setSearchKey(e.target.value)}
  //   placeholder="Search for name, title, skill, company, or country..."
  //   className="w-full bg-[#262629] border border-[#3A3A3C] rounded-none px-10 py-3 text-white focus:outline-none focus:ring-1 focus:ring-[#6366F1] transition shadow-md"
  // />