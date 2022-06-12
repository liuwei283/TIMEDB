class ApplicationController < ActionController::Base
    before_action :validate_cookie
    
    $user_stor_dir = "#{Rails.root}/data/user" 

    def change_dark
        session[:dark] = !session[:dark]
        respond_to do |format|
            format.js {render inline: "location.reload();" }
        end
    end

    private
    
    def require_cookie
        # no cookie found 
        unless session[:user_id]
            @user = User.new
            @user.dataset_n = 0
            @user.save
            session[:user_id] = @user.id
            session[:dark] = false
            
        end
        # check user
        id = session[:user_id]
        if User.exists? id
            
            @user = User.find(id)
            @user.touch

        else 
            # already expired
            @user = User.new
            @user.dataset_n = 0
            @user.save
            session[:user_id] = @user.id
        end
    end

    def validate_cookie
        # logger.error !params[:controller] == 'welcome'
        # logger.error "----------------------------------"
        # logger.error session[:user_id]
        # check if guest user has not already accepted the toc from session
        logger.error session[:user_id]
        if session[:user_id].nil? || !User.exists?(session[:user_id])
            redirect_to root_path, alert: 'Please accept cookie to continue.'
            logger.error params[:user_id]
            logger.error "----------------------------------"
            logger.error "----------------------------------"
            logger.error "----------------------------------"
            logger.error "application controller validate cookie"
            logger.error session[:user_id]
        end
    end

end
