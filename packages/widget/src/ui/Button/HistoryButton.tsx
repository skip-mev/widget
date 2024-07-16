import { ComponentProps } from 'react';
import { SimpleTooltip } from '../SimpleTooltip';
import { cn } from '../../utils/ui';
import { disclosure } from '../../store/disclosures';
import { HistoryIcon } from '../Icon/HistoryIcon';
import { StyledButton } from '../StyledComponents/Buttons';

export const HistoryButton = ({
  className,
  ...props
}: ComponentProps<'button'>) => {
  return (
    <SimpleTooltip label="Transaction History">
      <StyledButton
        className={cn(
          'rounded-full p-2',
          'transition-colors focus:outline-none',
          className
        )}
        onClick={() => disclosure.open('historyDialog')}
        role="group"
        {...props}
      >
        <HistoryIcon className="h-4 w-4" />
      </StyledButton>
    </SimpleTooltip>
  );
};
