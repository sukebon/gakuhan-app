import NotFound from "@/app/not-found";
import { auth } from "@/auth";
import StudentProductList from "@/components/students/StudentProductList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/firebase/server";
import { getGenderDisplay } from "@/utils/display";
import { Student } from "@/utils/student.interface";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
    studentId: string;
  };
}
export default async function PublicStudentShowPage({ params }: Props) {
  const { id, studentId } = params;
  const session = await auth();
  if (!session) return notFound();

  const role = session.user.role;
  if (studentId !== session.user.uid && role !== "member" && role !== "admin")
    return notFound();

  const studentSnap = await db
    .collection("schools")
    .doc(id)
    .collection("students")
    .doc(studentId)
    .get();

  if (!studentSnap.exists) return notFound();

  const studentRaw = JSON.stringify({
    ...studentSnap.data(),
    id: studentSnap.id,
  });
  const student = JSON.parse(studentRaw) as Student;
  const { zipCode, prefecture, city, street, building } = student.address;

  return (
    <div className="w-full max-w-[900px] mb-6 px-3">
      <header className="flex justify-between">
        <Button size="sm" variant="outline">
          <Link href={`/schools/${id}/students`}>一覧へ戻る</Link>
        </Button>
        <Button size="sm">
          <Link href={`/schools/${id}/students/${studentId}/edit`}>編集</Link>
        </Button>
      </header>
      <Card className="mt-3">
        <CardHeader>
          <CardTitle>詳細</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="space-y-1">
              <dl className="grid grid-cols-[100px_1fr]">
                <dt>学籍番号</dt>
                <dd>{student.studentNumber}</dd>
              </dl>
              <dl className="grid grid-cols-[100px_1fr]">
                <dt>氏名</dt>
                <dd>{`${student.lastName} ${student.firstName}`}</dd>
              </dl>
              <dl className="grid grid-cols-[100px_1fr]">
                <dt>性別</dt>
                <dd>{getGenderDisplay(student.gender)?.replace("用", "")}</dd>
              </dl>
              {student.totalAmount && (
                <dl className="grid grid-cols-[100px_1fr]">
                  <dt>金額</dt>
                  <dd>{student.totalAmount.toLocaleString()}円</dd>
                </dl>
              )}
            </div>
            <div className="space-y-1">
              {student.email && (
                <dl className="grid grid-cols-[100px_1fr]">
                  <dt>Email</dt>
                  <dd>{student.email}</dd>
                </dl>
              )}
              {student.tel && (
                <dl className="grid grid-cols-[100px_1fr]">
                  <dt>TEL</dt>
                  <dd>{student.tel}</dd>
                </dl>
              )}
              {zipCode && (
                <dl className="grid grid-cols-[100px_1fr]">
                  <dt>住所</dt>
                  <dd className="whitespace-pre-wrap">
                    {`〒${zipCode}\n${prefecture}${city}${street}\n${building}`}
                  </dd>
                </dl>
              )}
            </div>
          </div>
          <StudentProductList products={student.products} />
        </CardContent>
      </Card>
    </div>
  );
}
