"use client";

import { Link, useRouter } from "@/i18n/routing";
import { commerceService } from "@/services/commerce.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import type { Product } from "@/types/learning";
import { CheckCircle2, CreditCard, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function PricingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);

  useEffect(() => {
    commerceService
      .products()
      .then((res) => setProducts(res.data))
      .catch((err) => addToast(err?.message || "Không thể tải bảng giá", "error"))
      .finally(() => setLoading(false));
  }, [addToast]);

  const checkout = async (product: Product) => {
    const price = product.prices?.find((item) => item.isActive) || product.prices?.[0];
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!price) {
      addToast("Sản phẩm chưa có giá khả dụng", "error");
      return;
    }
    setPayingId(product.id);
    try {
      const order = await commerceService.createOrder(product.id, price.id);
      await commerceService.paySandbox(order.id);
      addToast("Thanh toán sandbox thành công, quyền lợi đã được cấp", "success");
    } catch (err: any) {
      addToast(err?.message || "Không thể thanh toán sandbox", "error");
    } finally {
      setPayingId(null);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-10">
      <section className="text-center space-y-4">
        <div className="mx-auto flex size-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <Sparkles className="size-7" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-black">Gói học LingoArena</h1>
        <p className="mx-auto max-w-2xl text-sm text-muted-foreground">
          Catalog lấy trực tiếp từ Commerce API. Sandbox pay sẽ hoàn tất đơn hàng và cấp entitlement ngay.
        </p>
      </section>

      {loading && <p className="text-center text-sm text-muted-foreground">Đang tải sản phẩm...</p>}
      {!loading && !products.length && (
        <div className="rounded-3xl border border-border bg-card p-8 text-center">
          <p className="font-bold">Chưa có sản phẩm đang bán.</p>
          <p className="mt-2 text-sm text-muted-foreground">Chạy seed commerce để tạo TEST-PACK-MINI.</p>
        </div>
      )}

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const price = product.prices?.find((item) => item.isActive) || product.prices?.[0];
          return (
            <article key={product.id} className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-5">
              <div className="space-y-2">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">{product.code}</p>
                <h2 className="text-2xl font-black">{product.name}</h2>
                <p className="min-h-12 text-sm text-muted-foreground">{product.description || "Gói mở khóa tài nguyên luyện thi."}</p>
              </div>
              <div>
                <p className="text-4xl font-black">
                  {Number(price?.amount || 0).toLocaleString("vi-VN")}
                  <span className="ml-1 text-sm text-muted-foreground">{price?.currency || "VND"}</span>
                </p>
              </div>
              <div className="space-y-2">
                {(product.entitlements || []).map((item) => (
                  <p key={item.id} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    {item.accessLevel} {item.resourceType}
                  </p>
                ))}
                {!product.entitlements?.length && (
                  <p className="flex items-center gap-2 text-sm">
                    <ShieldCheck className="size-4 text-emerald-500" />
                    Quyền lợi sẽ hiển thị sau khi admin cấu hình
                  </p>
                )}
              </div>
              <button
                type="button"
                disabled={payingId === product.id}
                onClick={() => checkout(product)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-black text-primary-foreground disabled:opacity-60"
              >
                <CreditCard className="size-4" />
                {payingId === product.id ? "Đang thanh toán..." : "Thanh toán sandbox"}
              </button>
            </article>
          );
        })}
      </section>

      <div className="text-center">
        <Link href="/path" className="text-sm font-bold text-primary">
          Sau khi mua, quay lại lộ trình học
        </Link>
      </div>
    </main>
  );
}
