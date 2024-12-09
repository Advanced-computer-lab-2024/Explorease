import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function AdvertiserStepByStepGuides() {
    const guides = [
        {
            title: "How To View Profile",
            steps: [
                "Click on the Sidebar Icon.",

                "Press on View Profile",
                
            ]
        },
        {
            title: "How To Delete An Account From Your Profile",
            steps: [
                "Click on the Sidebar Icon.",

                "Press on View Profile.",

                "Choose the profile you want to delete.",

                "Press on Delete Account.",
            
            ]
        },
        {
            title: "How To Update Profile",
            steps: [
                "Click on the Sidebar Icon.",

                "Press on View Profile.",

                "Press on the Pencil Icon (Edit Profile)",

                "Update the field.",
               
            ]
        },
        {
            title: "How To Update Password",
            steps: [
                "Click on the Sidebar Icon.",

                "Press on View Profile.",

                "Press on the Pencil Icon (Edit Profile)",

                "Write current and new passwords.",

            ]
        },
         {
            title: "How To Get Your Activities",
            steps: [
                "Click on the Sidebar Icon.",

                "Press Get My Activity.",

            ]
        },
        {
            title: "How To Search in Your Activities",
            steps: [
                "Click on the Sidebar Icon.",

                "Press Get My Activity.",

                "Search by name or category or tag.",

            ]
        }
        ,
        {
            title: "How To Filter in Your Activities",
            steps: [
                "Click on the Sidebar Icon.",

                "Press Get My Activity.",

                "Filter by name or category or tag.",

            ]
        },
        {
            title: "How To Edit in Your Activities",
            steps: [
                "Click on the Sidebar Icon.",

                "Press Create Activity.",

                "Press on the Pencil Icon .",

                "Fill in the fields.",

                "Press save once you finish/ or cancel if you did a mistake."


            ]
        }
        ,
        {
            title: "How To Create A New Activity",
            steps: [
                "Click on the Sidebar Icon.",

                "Press Create Activity.",


                "Fill in the fields.",

                "Press create activty once you finish."


            ]
        }
        ,
        {
            title: "How To Upload A Logo",
            steps: [
                "Click on the Sidebar Icon.",

                "Press under View Profile (Upload A Logo).",


                "Choose the photo.",

                "Press upload photo."


            ]
        }
        ,
        {
            title: "How To Get Your Sales Report",
            steps: [
                "Click on the Sidebar Icon.",

                "Press under View Profile (Sales Report).",


            ]
        },
        {
            title: "How To Filter in  Your Sales Report",
            steps: [
                "Click on the Sidebar Icon.",

                "Press under View Profile (Sales Report).",

                "Filter by date or month.",


            ]
        },
        {

            title: "How To View Activities",
            steps: [

                "Press On The Navbar",

                "Select Activities",
                

            ]
        },
        
        {

            title: "How To View Itineraries",
            steps: [

                "Press On The Navbar",

                "Select Itineraries",


            ]
        },

        

        {

            title: "How To Search in Itineraries",
            steps: [

                "Press On The Navbar",

                "Select Itineraries",


                "Search by name",

            ]
        },



        {

            title: "How To Filter in Itineraries",
            steps: [

                "Press On The Navbar",

                "Select Itineraries",


                "Filter by name",

            ]
        },


        {

            title: "How To View Historical Places",
            steps: [

                "Press On The Navbar",

                "Select Historical Places",


            ]
        }
        ,


        {

            title: "How To Search Historical Places",
            steps: [

                "Press On The Navbar",

                "Select Historical Places",

                "Search by name or tags",


            ]
        }

    ]

    return (

        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">

                Step-by-Step Guides
            </h1>

            <Card className="shadow-lg border border-blue-200">

                <CardHeader className="bg-blue-50 p-4 rounded-t">
                    <CardTitle className="text-2xl font-semibold text-blue-800">
                        Advertiser Guide
                    </CardTitle>


                </CardHeader>
                <CardContent className="p-4">

                    <Accordion type="single" collapsible className="w-full space-y-2">
                        {guides.map((guide, index) => (

                            <AccordionItem
                                key={index}

                                value={`guide-${index}`}
                                className="border border-blue-100 rounded-md overflow-hidden"
                            >

                                <AccordionTrigger className="text-blue-600 font-medium hover:text-blue-800 transition-colors duration-200 px-4 py-2 bg-blue-50">
                                    {guide.title}

                                </AccordionTrigger>
                                <AccordionContent className="bg-white">

                                    <ol className="list-decimal list-inside pl-4 py-2 space-y-1">
                                        {guide.steps.map((step, stepIndex) => (

                                            <li key={stepIndex} className="text-sm text-blue-600">
                                                {step}

                                            </li>
                                        ))}

                                    </ol>
                                </AccordionContent>

                            </AccordionItem>
                        ))}

                    </Accordion>
                </CardContent>

            </Card>
        </div>

    );

}
