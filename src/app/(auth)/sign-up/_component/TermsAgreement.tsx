import classNames from 'classnames/bind';
import { ReactNode } from 'react';
import styles from './TermsAgreement.module.scss';

const cn = classNames.bind(styles);

interface TermsAgreementProps {
  type: 'service' | 'privacyPolicy';
}

interface AgreementClause {
  title: string;
  content: string | ReactNode;
}

const SERVICE: AgreementClause[] = [
  {
    title: '제 1조 (목적)',
    content:
      '이 약관은 [서비스명] (이하 "회사")가 제공하는 서비스의 이용 조건 및 절차, 기타 필요한 사항을 규정함을 목적으로 합니다.',
  },
  {
    title: '제 2조 (이용 계약의 성립)',
    content:
      '이용 계약은 사용자가 약관에 동의하고, 회사가 이를 승인함으로써 성립됩니다. 회사는 필요한 경우 이용 신청을 거부하거나 이용을 제한할 수 있습니다.',
  },
  {
    title: '제 3조 (서비스의 제공 및 변경)',
    content:
      '회사는 서비스를 24시간, 연중무휴로 제공합니다. 단, 시스템 점검 등의 필요로 사전 공지 후 서비스 제공을 일시 중지할 수 있습니다. 회사는 필요한 경우 서비스의 내용을 변경할 수 있으며, 이 경우 변경된 내용을 사전에 공지합니다.',
  },
  {
    title: '제 4조 (이용자의 의무)',
    content:
      '이용자는 서비스 이용 시 법령 및 공공질서를 준수해야 하며, 서비스의 정상적인 운영을 방해해서는 안 됩니다. 이용자는 회사의 사전 동의 없이 서비스를 상업적 목적으로 이용할 수 없습니다.',
  },
  {
    title: '제 5조 (계약 해지 및 이용 제한)',
    content:
      '이용자는 언제든지 서비스 이용 계약을 해지할 수 있으며, 회사는 이에 따른 조치를 신속히 처리합니다. 회사는 이용자가 약관을 위반할 경우 서비스 이용을 제한하거나 계약을 해지할 수 있습니다.',
  },
  {
    title: '제 6조 (책임의 제한)',
    content:
      '회사는 무료로 제공되는 서비스에 대해 이용자에게 발생한 손해에 대해 책임을 지지 않습니다. 회사는 서비스 제공 과정에서 발생한 데이터 손실, 시스템 오류 등에 대해 책임을 지지 않습니다.',
  },
  {
    title: '제 7조 (기타 조항)',
    content:
      '이 약관은 대한민국 법률에 따라 해석 및 적용됩니다. 회사와 이용자 간의 분쟁이 발생할 경우, 회사의 주소지를 관할하는 법원을 전속 관할법원으로 합니다.',
  },
];

const OL_STYLE = { listStyleType: 'decimal', margin: '0rem 2rem' };
const UL_STYLE = { listStyleType: 'disc', margin: '0rem 1.5rem' };

const PRIVACY_POLICY: AgreementClause[] = [
  {
    title: '제 1조 (수집하는 개인정보의 항목 및 수집 방법)',
    content: (
      <ol style={OL_STYLE}>
        <li>
          회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다
          <ul style={UL_STYLE}>
            <li>필수 항목: 이름, 이메일 주소, 비밀번호, 휴대전화번호</li>
            <li>선택 항목: 생년월일, 성별</li>
          </ul>
        </li>
        <li>회사는 회원가입, 서비스 이용, 이벤트 참여 등에서 개인정보를 수집합니다.</li>
      </ol>
    ),
  },
  {
    title: '제 2조 (개인정보의 수집 및 이용 목적)',
    content: (
      <ol style={OL_STYLE}>
        <li>
          서비스 제공 및 회원 관리
          <ul style={UL_STYLE}>
            <li>회원 식별 및 본인 확인</li>
            <li>서비스 이용에 따른 본인 인증</li>
          </ul>
        </li>
        <li>
          마케팅 및 광고
          <ul style={UL_STYLE}>
            <li>이벤트 정보 제공 및 참여 기회 제공</li>
            <li>맞춤형 서비스 및 광고 제공</li>
          </ul>
        </li>
      </ol>
    ),
  },
  {
    title: '제 3조 (개인정보의 보유 및 이용 기간)',
    content: (
      <ol style={OL_STYLE}>
        <li>회사는 회원 탈퇴 시 개인정보를 즉시 삭제합니다.</li>
        <li>단, 관계 법령에 따라 일정 기간 보관해야 하는 정보는 해당 기간 동안 보관합니다.</li>
      </ol>
    ),
  },
  {
    title: '제 4조 (개인정보의 제3자 제공)',
    content: (
      <ol style={OL_STYLE}>
        <li>회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.</li>
        <li>다만, 법령에 따라 필요한 경우, 이용자의 동의를 받아 제공할 수 있습니다.</li>
      </ol>
    ),
  },
  {
    title: '제 5조 (개인정보의 파기)',
    content: (
      <ol style={OL_STYLE}>
        <li>회사는 개인정보의 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.</li>
        <li>
          파기 방법: 전자적 파일 형태의 정보는 복구 불가능한 방법으로 삭제하고, 종이 문서 형태의 정보는 분쇄하거나
          소각합니다.
        </li>
      </ol>
    ),
  },
  {
    title: '제 6조 (이용자의 권리)',
    content: (
      <ol style={OL_STYLE}>
        <li>이용자는 언제든지 자신의 개인정보를 조회하거나 수정할 수 있으며, 처리 정지를 요구할 수 있습니다.</li>
        <li>이용자는 개인정보 보호책임자에게 이메일을 통해 문의할 수 있습니다.</li>
      </ol>
    ),
  },
  {
    title: '제 7조 (개인정보 보호책임자 및 연락처)',
    content: (
      <>
        회사는 개인정보 보호와 관련한 불만 처리 및 상담 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다:
        <ul style={UL_STYLE}>
          <li>이름: [개인정보 보호책임자 이름]</li>
          <li>이메일: [개인정보 보호책임자 이메일 주소]</li>
          <li>전화번호: [연락처]</li>
        </ul>
      </>
    ),
  },
  {
    title: '제 8조 (개인정보 처리방침의 변경)',
    content: '이 개인정보 처리방침은 법령 또는 회사 정책에 따라 변경될 수 있으며, 변경 사항은 사전에 공지합니다.',
  },
];

export function TermsAgreement({ type }: TermsAgreementProps) {
  const CONTENT_LIST = type === 'service' ? SERVICE : PRIVACY_POLICY;

  return (
    <div className={cn('container')}>
      {CONTENT_LIST.map((terms) => (
        <article key={terms.title}>
          <h2 className={cn('title')}>{terms.title}</h2>
          <p className={cn('content')}>{terms.content}</p>
        </article>
      ))}
    </div>
  );
}
