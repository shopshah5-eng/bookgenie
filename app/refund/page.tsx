import { permanentRedirect } from 'next/navigation';

export default function RefundLegacyRedirect() {
  permanentRedirect('/refunds');
}
