import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/tabs/tabs"

export function ProjectTypePicker() {
    return (
      <div className="flex w-full max-w-sm flex-col gap-6 dark bg-transparent text-white p-4 rounded-xl">
        <Tabs defaultValue="account">

          <TabsList className="bg-black border border-white-900 rounded-lg">
            <TabsTrigger
              value="account"
              className="text-white data-[state=active]:bg-gray-700 data-[state=active]:text-white"
            >
              Templates
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className="text-white data-[state=active]:bg-gray-700 data-[state=active]:text-white"
            >
              Owned
            </TabsTrigger>
            <TabsTrigger
              value="aigen"
              className="text-white data-[state=active]:bg-gray-700 data-[state=active]:text-white"
            >
              AI Generated
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card className="bg-black text-white border border-white-900">
              
              {/* card header with title and description */}
              <CardHeader>
                <CardTitle style={{color:'darkgray'}}>Templates</CardTitle>
                <CardDescription className="text-gray-400">
                </CardDescription>
              </CardHeader>
              
              {/* content section with templates */}
              <CardContent className="grid gap-6">

              </CardContent>

              {/* footer with else content */}
              <CardFooter>
                
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card className="bg-black text-white border border-white-900">
              
              {/* card header with title and description */}
              <CardHeader>
                <CardTitle style={{color:'darkgray'}}>Owned</CardTitle>
                <CardDescription className="text-gray-400">
                </CardDescription>
              </CardHeader>
              
              {/* content section with templates */}
              <CardContent className="grid gap-6">

              </CardContent>

              {/* footer with else content */}
              <CardFooter>
                
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="aigen">
            <Card className="bg-black text-white border border-white-900">
              
              {/* card header with title and description */}
              <CardHeader>
                <CardTitle style={{color:'darkgray'}}>AI Generated</CardTitle>
                <CardDescription className="text-gray-400">
                </CardDescription>
              </CardHeader>
              
              {/* content section with templates */}
              <CardContent className="grid gap-6">

              </CardContent>

              {/* footer with else content */}
              <CardFooter>
                
              </CardFooter>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    );
}
