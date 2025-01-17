'use client';

import { IMAGE_BLUR } from '@/constants/blurImage';
import { CameraIcon, keydeukProfileImg } from '@/public/index';

import classNames from 'classnames/bind';

import Image, { StaticImageData } from 'next/image';
import { ChangeEvent, LegacyRef, forwardRef, memo, useEffect, useState } from 'react';

import styles from './ProfileImage.module.scss';

const cn = classNames.bind(styles);

interface ProfileImageProp {
  profileImage: StaticImageData | string | null;
  width?: number;
  height?: number;
  isEditable?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

function Profile(
  { profileImage, width = 64, height = 64, isEditable = false, onChange, ...rest }: ProfileImageProp,
  ref: LegacyRef<HTMLInputElement>,
) {
  const [currentImageFile, setCurrentImageFile] = useState<string | StaticImageData>(profileImage || keydeukProfileImg);
  const [isImageError, setIsImageError] = useState<boolean>(false);

  useEffect(() => {
    if (!profileImage || profileImage === 'null') {
      setIsImageError(true);
      return;
    }

    setCurrentImageFile(profileImage);
  }, [profileImage]);

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files || files.length === 0) {
      return;
    }

    const imageUrl = URL.createObjectURL(files[0]);
    setCurrentImageFile(imageUrl);
    setIsImageError(false);

    if (onChange) {
      onChange(e);
    }
  };

  return (
    <label htmlFor='profileInput' className={cn({ label: isEditable })}>
      <div className={cn('profile-image-wrapper')}>
        <Image
          src={isImageError || !currentImageFile || currentImageFile === 'null' ? keydeukProfileImg : currentImageFile}
          alt='프로필 이미지'
          width={width}
          height={height}
          className={cn('profile-image')}
          onError={() => setIsImageError(true)}
          priority
          placeholder={IMAGE_BLUR.placeholder}
          blurDataURL={IMAGE_BLUR.blurDataURL}
        />
        {isEditable && (
          <div className={cn('image-input-wrapper')}>
            <CameraIcon fill='white' width={25} height={22.5} />
            <input
              ref={ref}
              type='file'
              className={cn('file-input')}
              id='profileInput'
              onChange={handleChangeImage}
              accept='image/png, image/jpeg, image/jpg'
              {...rest}
            />
          </div>
        )}
      </div>
    </label>
  );
}

const ProfileImage = memo(forwardRef(Profile));
export default ProfileImage;
