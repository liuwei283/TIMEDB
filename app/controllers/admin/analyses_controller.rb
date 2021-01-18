class Admin::AnalysesController < ApplicationController

  before_action :set_analyses_category, except: :index
  before_action :set_analysis, only: %w(edit update destroy)

  def index
    @analysis_categories = AnalysisCategory.unscoped
  end

  def new
    @analysis = @analysis_category.analyses.new
  end

  def create
    @analysis = @analysis_category.analyses.build analysis_params

    if @analysis.save
      flash[:success] = "Analysis created."
      redirect_to admin_analyses_path
    else
      flash[:error] = @analysis.errors.full_messages
      render action: 'new'
    end
  end

  def edit

  end

  def update
    p = analysis_params
    begin
      p[:files_info] = JSON.parse p[:files_info]
    rescue
      flash[:error] = 'Please enter a valid JSON string.'
      return render 'edit'
    end

    if @analysis.update(p)
      flash[:success] = "Analysis updated."
      redirect_to admin_analyses_path
    else
      flash[:error] = @analysis.errors.full_messages
      redirect_to edit_admin_analysis_category_analysis_path(@analysis_category, @analysis)
    end
  end

  def destroy
    @analysis.destroy
    flash[:success] = "Analysis deleted."
    redirect_to admin_analysis_categories_path
  end

  def update_position
    params[:position].split(',').each_with_index do |id, index|
      Analysis.update id, position: index
    end
  end

  private

  def analysis_params
    params.require(:analysis).permit(:name, :visualizer_id, :files_info,
                                     :mid, :analysis_category_id)
  end

  def set_analyses_category
    @analysis_category = AnalysisCategory.unscoped.find(params[:analysis_category_id])
  end

  def set_analysis
    @analysis = @analysis_category.analyses.unscoped.find(params[:id])
  end

end
