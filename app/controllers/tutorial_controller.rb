class TutorialController < ApplicationController
    skip_before_action :validate_cookie, only: []

    def database1
    end
    def database2
    end
    def database3
    end
    def database4
    end
    def database5
    end
    def database6
    end    
    def analysis1
    end
    def analysis2
    end
    def analysis3
        @all_analysis = Analysis.all;
        gon.push all_analysis:@all_analysis

    end
    def analysis4
    end
end
