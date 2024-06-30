"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCreateModal } from "./new/ProductCreateModal";
import { useEffect, useState } from "react";
import { collection, getCountFromServer, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/client";
import { Product } from "@/utils/product.interface";
import ProductsList from "./ProductsList";
import ProductDragAndDrop from "./ProductDragAndDrop";
import LoaderIcon from "../LoaderIcon";

export default function ProductContainer({ id }: { id: string; }) {
  const [products, setProducts] = useState<Product[]>();
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    const productsRef = collection(db, "schools", id, "products");
    const q = query(productsRef, orderBy("sortNum", "asc"));
    const unsub = onSnapshot(q, {
      next: (snapshot) => {
        setProducts(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Product))
        );
      },
      error: (e) => {
        console.log(e);
      },
    });
    return () => unsub();
  }, [id]);

  useEffect(() => {
    const getStudents = async () => {
      const studentsRef = collection(db, "schools", id, "public-students");
      const studentsSnap = await getCountFromServer(studentsRef);
      const count = studentsSnap.data().count;
      setStudentCount(count);
    };
    getStudents();
  }, [id]);

  if (!products) return;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="whitespace-pre-line">商品</CardTitle>
        {studentCount === 0 && (
          <div className="flex justify-end items-center gap-3 mb-3">
            {products.length > 1 && (
              <ProductDragAndDrop id={id} products={products} />
            )}
            <ProductCreateModal id={id} />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ProductsList id={id} products={products} studentCount={studentCount} />
      </CardContent>
    </Card>
  );
}
