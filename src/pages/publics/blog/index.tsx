import { enumData } from "@/common/enums/enum";
import { formatDate } from "@/common/helpers";
import Title from "@/components/ui/Tilte";
import { usePaginationBlog } from "@/hooks/blog";
import { useRouter } from "@/routes/hooks/use-router";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Paginator } from "primereact/paginator";
import { Skeleton } from "primereact/skeleton";
import { Tag } from "primereact/tag";
import { useState } from "react";

export default function BlogScreen() {
  const router = useRouter();
  const [first, setFirst] = useState(0);
  const itemsPerPage = 9;

  const {
    data: blogs,
    total,
    isLoading,
  } = usePaginationBlog({
    skip: first,
    take: itemsPerPage,
    where: {
      isDeleted: false,
    },
  });

  const onPageChange = (event: any) => {
    setFirst(event.first);
  };

  const renderBlogCard = (blog: any) => {
    const header = (
      <div className="relative overflow-hidden">
        <img
          alt={blog.title}
          src={
            blog.featuredImage?.fileUrl ||
            "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80"
          }
          className="w-full h-80 object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/20 to-black/75" />

        {/* Date Badge */}
        <div className="absolute top-4 right-4 bg-white rounded-xl shadow-lg p-3 text-center min-w-16">
          <div className="text-xl font-bold text-teal-600">
            {formatDate(blog.publishedAt || blog.createdAt)}
          </div>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Tag
              value={`${blog.author?.fullName || blog.author?.username || "Admin"}`}
              severity="warning"
              icon="pi pi-user"
            />
            {blog.category && (
              <Tag value={blog.category} severity="info" icon="pi pi-tag" />
            )}
          </div>
          <h3 className="text-xl font-bold text-white leading-tight line-clamp-2 mb-2">
            {blog.title}
          </h3>
          {blog.excerpt && (
            <p className="text-sm text-gray-200 line-clamp-2">{blog.excerpt}</p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 mt-3 text-white text-sm">
            <span className="flex items-center gap-1">
              <i className="pi pi-eye"></i>
              {blog.viewCount || 0}
            </span>
            <span className="flex items-center gap-1">
              <i className="pi pi-heart"></i>
              {blog.likeCount || 0}
            </span>
          </div>
        </div>
      </div>
    );

    return (
      <Card
        header={header}
        className="cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
        onClick={() => router.push(`/blogs/${blog.slug}`)}
      />
    );
  };

  const renderSkeletonCard = () => {
    return (
      <Card className="overflow-hidden">
        <Skeleton width="100%" height="20rem" />
        <div className="p-4">
          <Skeleton width="60%" className="mb-2" />
          <Skeleton width="100%" height="4rem" />
        </div>
      </Card>
    );
  };

  return (
    <div className="">
      {/* Blog Grid Section */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center mb-12">
          <Title>Blog</Title>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto font-light leading-relaxed mt-4">
            Tổng hợp các bài viết chia sẻ kiến thức, kinh nghiệm, xu hướng trong
            lĩnh vực du lịch, học tập và phát triển bản thân.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {isLoading ? (
            Array.from({ length: itemsPerPage }).map((_, index) => (
              <div key={index}>{renderSkeletonCard()}</div>
            ))
          ) : blogs.length > 0 ? (
            blogs.map((blog: any) => (
              <div key={blog.id}>{renderBlogCard(blog)}</div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <i className="pi pi-inbox text-6xl text-gray-300 mb-4"></i>
              <p className="text-xl text-slate-500">Chưa có bài viết nào</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && total > 0 && (
          <Paginator
            currentPageReportTemplate={`Hiển thị {first} - {last} trong tổng số {totalRecords} bài viết`}
            totalRecords={total}
            rows={itemsPerPage}
            first={first}
            onPageChange={onPageChange}
            rowsPerPageOptions={enumData.PAGE.LST_PAGESIZE}
            template="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            className="w-full border-none custom-grid-paginator"
          />
        )}
      </section>

      <Divider />

      {/* Wave Separator */}
      <svg
        className="w-full h-24"
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0 0C240 40 480 80 720 80C960 80 1200 40 1440 0V120H0V0Z"
          fill="#FFA500"
        />
      </svg>
    </div>
  );
}
