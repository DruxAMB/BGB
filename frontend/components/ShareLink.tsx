'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import FacebookIcon from '../public/icons/facebook.svg';
import WhatsAppIcon from '../public/icons/whatsapp.svg';
import TwitterIcon from '../public/icons/X.svg';
import InstagramIcon from '../public/icons/ig.svg';
import CopySvg from '@/app/svg/CopySvg';

const ShareLink = () => {
  const params = useParams();
  const [packageId, setPackageId] = useState('');
  const [error, setError] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

useEffect(() => {
  const createTestPackage = async () => {
    try {
      const response = await fetch('/api/saved-package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: 'test-package-123' }),
      });

      if (!response.ok) {
        throw new Error('Failed to create test package');
      }

      const data = await response.json();
      setPackageId(data.savedPackageId);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to create test package',
      );
    }
  };

  if (process.env.NODE_ENV === 'development') {
    createTestPackage();
  } else {
    // Original fetchPackage logic
    const fetchPackage = async () => {
      try {
        setIsLoaded(true);
        const savePackageId = params.id;
        const response = await fetch(`/api/saved-package/${savePackageId}`);

        if (!response.ok) {
          throw new Error('Package not found');
        }

        const data = await response.json();
        setPackageId(data.packageId);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Failed to fetch package',
        );
      } finally {
        setIsLoaded(false);
      }
    };

    if (params.id) {
      fetchPackage();
    }
  }
}, [params.id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsLoaded(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  const copyToClipboard = () => {
    const url = `/claim/${packageId}`;
    navigator.clipboard.writeText(url).then(() => {
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
    });
  };

  const shareOnSocialMedia = (platform: string) => {
    const url = `/claim/${packageId}`;
    const encodedUrl = encodeURIComponent(url);

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}`;
        break;
      case 'instagram':
        alert('Instagram sharing is not supported via links. Share manually.');
        return;
      default:
        return;
    }

    window.open(shareUrl, '_blank');
  };

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] w-full items-center justify-center text-red-500 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-100px)] w-full items-center justify-center text-white p-4 lg:p-3 md:p-2 sm:p-16">
      <div className="mt-12 mb-12 w-full max-w-[520px]">
        <div className="flex justify-center mb-6">
          <div className="lg:h-[500px] h-[350px] w-full">
            <video
              ref={videoRef}
              src={isLoaded ? '/video/share-link.mp4' : undefined}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>
        <div className="text-center mt-8 text-lg font-semibold text-black">
          Send This To Your Friend To Claim
        </div>

        <div
          onClick={copyToClipboard}
          className="flex items-center justify-between w-full border border-white/10 bg-black/5 h-[46px] rounded-full px-4 mt-3 cursor-pointer"
        >
          <div className="text-black/60 text-lg overflow-hidden overflow-ellipsis whitespace-nowrap">
            {packageId ? `/claim/${packageId}` : 'Loading...'}
          </div>
          <button
            onClick={copyToClipboard}
            className="ml-2"
            title="copy link"
            aria-label="Copy link"
          >
            <CopySvg />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-6">
          <div className="text-lg color text-[#020202]">Share on:</div>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => shareOnSocialMedia('facebook')}
              title="facebook"
            >
              <Image src={FacebookIcon} alt="Facebook" width={24} height={24} />
            </button>
            <button
              onClick={() => shareOnSocialMedia('whatsapp')}
              title="whatsapp"
            >
              <Image src={WhatsAppIcon} alt="WhatsApp" width={24} height={24} />
            </button>
            <button onClick={() => shareOnSocialMedia('twitter')} title="X">
              <Image src={TwitterIcon} alt="Twitter" width={24} height={24} />
            </button>
            <button
              onClick={() => shareOnSocialMedia('instagram')}
              title="instagram"
            >
              <Image
                src={InstagramIcon}
                alt="Instagram"
                width={24}
                height={24}
              />
            </button>
          </div>
        </div>

        <button className="flex items-center justify-center w-full mt-14 gap-4 p-2 bg-[#2455FF] rounded-full">
          Send another Gift{' '}
          <img
            src="/gift.gif"
            alt="Descriptive text for the GIF"
            loading="lazy"
            className="w-8"
          />
        </button>
      </div>

      {toastVisible && (
        <div className="fixed top-20 right-auto text-white p-3 rounded-lg shadow-lg bg-blue-800">
          Link copied! It expires in 7 days.
        </div>
      )}
    </div>
  );
};

export default ShareLink;
