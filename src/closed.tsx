import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";

export default function Closed() {
  return (
    <div className="container mx-auto px-5 lg:px-20 pt-20">
      <Card>
        <CardHeader>
          <CardTitle>Thank you for your participation.</CardTitle>
        </CardHeader>
        <CardContent>
          <h1 className="text-4xl font-bold opacity-60">
            Recruitment is over.
          </h1>
          <p className=" p-0">Check your email for further updates.</p>
        </CardContent>
        <CardFooter>
          <p className="opacity-40">
            <small>Developed by ROBU WEB DEV TEAM</small>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
