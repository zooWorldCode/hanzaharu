export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold">관리자 페이지</h1>
      <p className="mt-2 text-muted-foreground">
        admin 권한이 있는 사용자만 접근할 수 있습니다.
      </p>
    </div>
  );
}
