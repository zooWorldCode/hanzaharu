import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ForbiddenPage() {
  return (
    <div className="container mx-auto flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md rounded-3xl text-center">
        <CardHeader>
          <CardTitle className="text-6xl font-bold text-destructive">403</CardTitle>
          <CardDescription className="text-base">
            이 페이지에 접근할 권한이 없습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full rounded-2xl">
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
