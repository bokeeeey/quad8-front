import ImageZoom from '@/components/ImageZoom/ImageZoom';

export default function ImageZoomText() {
  const imageUrl = 'https://cdn.imweb.me/thumbnail/20220404/12007f769b366.jpg';
  return (
    <div style={{ marginLeft: 130 }}>
      <ImageZoom image={imageUrl} alt='테스트용' width={500} height={500} />
    </div>
  );
}
