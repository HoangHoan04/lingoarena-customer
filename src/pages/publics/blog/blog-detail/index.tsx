import { formatDate } from "@/common/helpers";
import LabelTag from "@/components/ui/LabelTag";
import Title from "@/components/ui/Tilte";
import {
  useBlogBySlug,
  useBlogComments,
  useCreateBlogComment,
  useLikeBlog,
  useRelatedBlogs,
} from "@/hooks/blog";
import { useRouter } from "@/routes/hooks/use-router";
import { tokenCache } from "@/utils";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Image } from "primereact/image";
import { InputTextarea } from "primereact/inputtextarea";
import { Skeleton } from "primereact/skeleton";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { useRef, useState, useMemo } from "react";
import { useParams } from "react-router-dom";

export default function BlogDetailScreen() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const toast = useRef<Toast>(null);

  const { data: blog, isLoading } = useBlogBySlug(slug);
  const { likeBlog, isLoading: isLiking } = useLikeBlog();
  const { createComment, isLoading: isCreatingComment } =
    useCreateBlogComment();

  const [commentContent, setCommentContent] = useState("");

  const isLoggedIn = useMemo(() => tokenCache.isAuthenticated(), []);

  const { data: comments = [], refetch: refetchComments } = useBlogComments(
    blog?.id,
    { skip: 0, take: 100 },
  );

  const { data: relatedBlogs } = useRelatedBlogs(blog?.id, 3);

  const handleSubmitComment = () => {
    if (!isLoggedIn) {
      return;
    }
    if (!commentContent.trim()) return;

    createComment(
      { postId: blog!.id, content: commentContent },
      {
        onSuccess: () => {
          setCommentContent("");
          refetchComments();
          toast.current?.show({
            severity: "success",
            summary: "Thành công",
            detail: "Bình luận của bạn đã được gửi.",
          });
        },
      },
    );
  };

  if (isLoading) return <BlogLoadingSkeleton />;

  if (!blog) return <BlogNotFound onClick={() => router.push("/blogs")} />;

  return (
    <div className="min-h-screen bg-[--surface-ground] transition-colors duration-300 pb-12">
      <Toast ref={toast} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* --- MAIN CONTENT (LEFT) --- */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header: Title & Meta */}
            <div className="space-y-4">
              <Tag
                value={blog.category || "Tin tức"}
                severity="info"
                className="uppercase text-xs"
              />
              <Title className="text-left text-3xl md:text-5xl font-black leading-tight text-[--text-color]">
                {blog.title}
              </Title>

              <div className="flex items-center flex-wrap gap-4 text-sm text-[--text-color-secondary] py-2 border-y border-[--surface-border]">
                <div className="flex items-center gap-2">
                  <Avatar icon="pi pi-user" shape="circle" size="normal" />
                  <span className="font-semibold text-[--text-color]">
                    {blog.author?.username || "Admin"}
                  </span>
                </div>
                <Divider layout="vertical" className="hidden md:block" />
                <div className="flex items-center gap-2">
                  <i className="pi pi-calendar" />
                  <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="pi pi-eye" />
                  <span>{blog.viewCount || 0} lượt xem</span>
                </div>
              </div>
            </div>

            {/* Featured Image - Hiện thị riêng biệt không đè chữ */}
            {blog.featuredImage && (
              <div className="rounded-3xl overflow-hidden shadow-lg border border-[--surface-border] bg-[--surface-card]">
                <Image
                  src={blog.featuredImage.fileUrl}
                  alt={blog.title}
                  className="w-full"
                  imageClassName="w-full max-h-[500px] object-cover hover:scale-105 transition-transform duration-700"
                  preview
                />
              </div>
            )}

            {/* Blog Body */}
            <div className="bg-[--surface-card] p-6 md:p-10 rounded-3xl shadow-sm border border-[--surface-border]">
              {/* Excerpt */}
              {blog.excerpt && (
                <div className="mb-8 p-4 bg-[--primary-50] border-l-4 border-[--primary-color] rounded-r-lg">
                  <p className="italic text-lg text-[--text-color] opacity-80">
                    {blog.excerpt}
                  </p>
                </div>
              )}

              {/* Main Content Render */}
              <article
                className="prose prose-lg dark:prose-invert max-w-none 
                  prose-p:text-[--text-color] prose-p:opacity-90 prose-p:leading-relaxed
                  prose-headings:text-[--text-color] prose-strong:text-[--text-color]
                  prose-img:rounded-2xl prose-a:text-[--primary-color]"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Action: Like & Share */}
              <div className="mt-10 pt-6 border-t border-[--surface-border] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    label={String(blog.likeCount || 0)}
                    icon={`pi ${blog.likeCount > 0 ? "pi-heart-fill" : "pi-heart"}`}
                    className={`p-button-rounded ${blog.likeCount > 0 ? "p-button-danger" : "p-button-outlined p-button-secondary"}`}
                    loading={isLiking}
                    onClick={() =>
                      isLoggedIn ? likeBlog(blog.id) : router.push("/login")
                    }
                  />
                  <span className="text-sm font-medium opacity-60">
                    Thích bài viết này
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    icon="pi pi-facebook"
                    text
                    rounded
                    severity="secondary"
                  />
                  <Button
                    icon="pi pi-twitter"
                    text
                    rounded
                    severity="secondary"
                  />
                  <Button
                    icon="pi pi-share-alt"
                    text
                    rounded
                    severity="secondary"
                  />
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-[--surface-card] p-6 md:p-10 rounded-3xl shadow-sm border border-[--surface-border] space-y-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <i className="pi pi-comments text-[--primary-color]" />
                Bình luận ({comments.length})
              </h3>

              <div className="flex gap-4">
                <Avatar
                  icon="pi pi-user"
                  size="large"
                  shape="circle"
                  className="bg-[--surface-100]"
                />
                <div className="flex-1 space-y-3">
                  <InputTextarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Bạn nghĩ gì về bài viết này?"
                    rows={3}
                    className="w-full rounded-xl border-[--surface-border] bg-[--surface-ground] focus:bg-[--surface-card]"
                  />
                  <div className="flex justify-end">
                    <Button
                      label="Gửi bình luận"
                      icon="pi pi-send"
                      disabled={!commentContent.trim() || isCreatingComment}
                      loading={isCreatingComment}
                      onClick={handleSubmitComment}
                      className="px-6 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <Divider />

              <div className="space-y-6">
                {comments.map((comment: any) => (
                  <div key={comment.id} className="flex gap-4">
                    <Avatar
                      image={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.customer?.username}`}
                      shape="circle"
                    />
                    <div className="flex-1 p-4 rounded-2xl bg-[--surface-ground]">
                      <div className="flex justify-between mb-2">
                        <span className="font-bold">
                          {comment.customer?.fullName || "Người dùng"}
                        </span>
                        <span className="text-xs opacity-50">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm opacity-90">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* --- SIDEBAR (RIGHT) --- */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-3xl border border-[--surface-border]">
              <LabelTag>Bài viết liên quan</LabelTag>
              <div className="space-y-5 mt-6">
                {relatedBlogs?.map((item: any) => (
                  <div
                    key={item.id}
                    className="group flex gap-4 cursor-pointer"
                    onClick={() => router.push(`/blogs/${item.slug}`)}
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-[--surface-100]">
                      <img
                        src={item.featuredImage?.fileUrl}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-bold text-sm line-clamp-2 group-hover:text-[--primary-color] transition-colors">
                        {item.title}
                      </h5>
                      <p className="text-xs opacity-50 mt-1">
                        {formatDate(item.publishedAt || item.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-3xl border border-[--surface-border] bg-[--primary-color] text-white">
              <h4 className="font-bold mb-2">Đăng ký bản tin</h4>
              <p className="text-xs opacity-80 mb-4 text-white">
                Nhận những cập nhật du lịch mới nhất qua email của bạn.
              </p>
              <div className="p-inputgroup">
                <Button
                  label="Theo dõi ngay"
                  className="p-button-secondary w-full rounded-xl"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlogNotFound({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <i className="pi pi-search text-6xl opacity-20" />
      <h2 className="text-2xl font-bold">Không tìm thấy bài viết</h2>
      <Button
        label="Quay lại danh sách"
        icon="pi pi-arrow-left"
        text
        onClick={onClick}
      />
    </div>
  );
}

function BlogLoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <Skeleton width="40%" height="2rem" />
      <Skeleton height="3rem" width="80%" />
      <Skeleton height="400px" className="rounded-3xl" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          <Skeleton height="20rem" />
        </div>
        <div className="lg:col-span-4 space-y-4">
          <Skeleton height="10rem" />
        </div>
      </div>
    </div>
  );
}
