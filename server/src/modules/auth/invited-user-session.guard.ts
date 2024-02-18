import {
  BadRequestException,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrganizationUsersService } from '@services/organization_users.service';
import { getUserErrorMessages, USER_STATUS } from 'src/helpers/user_lifecycle';

/* 
This guard will check all possible cases to reject an invalid invitation session request
- Request obj will have 2 users details if the session is valid
   1. JWT user
   2. Invited user
*/
@Injectable()
export class InvitedUserSessionAuthGuard extends AuthGuard('jwt') {
  constructor(private organizationUsersService: OrganizationUsersService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const workspaceInviteToken = request.body.organizationToken;
    let isValidUser: any;

    if (!workspaceInviteToken) {
      throw new BadRequestException(
        'The workspace invite token is missing from the request parameters. Please provide a valid token to proceed.'
      );
    }

    const invitedUser = await this.organizationUsersService.findByWorkspaceInviteToken(workspaceInviteToken);
    const { email: invitedUserEmail, status: invitedUserStatus } = invitedUser;
    request.invitedUser = invitedUser;

    const isOrganizationOnlyInvite = !!workspaceInviteToken && !request.body.accountToken;
    if (isOrganizationOnlyInvite && invitedUserStatus !== USER_STATUS.ACTIVE) {
      /* User has the organization token, But the account isn't activated yet */
      throw new BadRequestException(getUserErrorMessages(invitedUserStatus));
    }

    try {
      request.isUserNotMandatory = true;
      request.isInviteSession = true;
      isValidUser = await super.canActivate(context);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        /* No valid session / Expired token */
        return this.onInvalidSession(invitedUser);
      }
      throw new BadRequestException(
        'Invalid or expired invitation session. Please check your invitation and try again.'
      );
    }

    if (isValidUser) {
      /* Check if the same user is accepting invite or not */
      /* Only for a valid session (Activated user) */
      if (request.user?.email !== invitedUserEmail) {
        const errorResponse = {
          message: {
            error:
              'Your session does not match the invited user. Please logout and login to the invited user email account.',
            isInvitationTokenAndUserMismatch: true,
          },
        };
        throw new ForbiddenException(errorResponse);
      }
    }

    return isValidUser;
  }

  async onInvalidSession(invitedUser: any) {
    const { invitationToken, status } = invitedUser;
    if (invitationToken && [USER_STATUS.INVITED, USER_STATUS.VERIFIED].includes(status as USER_STATUS)) {
      /* User doesn't have a valid session & User didn't activate account yet */
      return invitedUser;
    } else {
      /* User doesn't have a session. Next?: login again and accept invite */
      return false;
    }
  }
}